/*
LePina MVP Web Database (SQL Server 2019/2022+)
Tables = PascalCase, Columns = camelCase
PK = INT, Images = VARBINARY(MAX)
Generated: 2025-10-16
*/

IF DB_ID(N'lepina') IS NULL
BEGIN
    CREATE DATABASE lepina COLLATE Vietnamese_100_CI_AS;
END;
GO
USE lepina;
GO

-- ==================
-- Core Reference
-- ==================

CREATE TABLE dbo.Products (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Products PRIMARY KEY,
  name NVARCHAR(120) NOT NULL CONSTRAINT UQ_Products_Name UNIQUE,
  description NVARCHAR(MAX) NULL,
  origin NVARCHAR(MAX) NULL,
  status NVARCHAR(20) NOT NULL CONSTRAINT DF_Products_Status DEFAULT N'Testing',
  imageData VARBINARY(MAX) NULL,
  imageMimeType NVARCHAR(100) NULL,
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_Products_Created DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Products_Updated DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_Products_Status CHECK (status IN (N'Draft', N'Testing', N'Launched'))
);
GO

CREATE OR ALTER TRIGGER dbo.trg_Products_Touch ON dbo.Products
AFTER UPDATE AS
BEGIN
  SET NOCOUNT ON;
  UPDATE p SET updatedAt = SYSUTCDATETIME()
  FROM dbo.Products p
  JOIN inserted i ON i.id = p.id;
END;
GO

CREATE TABLE dbo.Ingredients (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Ingredients PRIMARY KEY,
  name NVARCHAR(120) NOT NULL CONSTRAINT UQ_Ingredients_Name UNIQUE,
  kind NVARCHAR(20) NOT NULL CONSTRAINT DF_Ingredients_Kind DEFAULT N'Other',
  notes NVARCHAR(MAX) NULL,
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_Ingredients_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_Ingredients_Kind CHECK (kind IN (N'Fruit', N'Enzyme', N'Acid', N'Other'))
);
GO

CREATE TABLE dbo.ProductIngredients (
  productId INT NOT NULL,
  ingredientId INT NOT NULL,
  [percent] DECIMAL(5,2) NULL,
  notes NVARCHAR(MAX) NULL,
  CONSTRAINT PK_ProductIngredients PRIMARY KEY (productId, ingredientId),
  CONSTRAINT FK_PI_Product FOREIGN KEY (productId) REFERENCES dbo.Products(id) ON DELETE CASCADE,
  CONSTRAINT FK_PI_Ingredient FOREIGN KEY (ingredientId) REFERENCES dbo.Ingredients(id) ON DELETE CASCADE,
  CONSTRAINT CK_PI_Percent_Range CHECK ([percent] IS NULL OR ([percent] >= 0 AND [percent] <= 100))
);
GO

CREATE TABLE dbo.ProductPrices (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ProductPrices PRIMARY KEY,
  productId INT NOT NULL,
  priceVnd INT NOT NULL,
  currency NVARCHAR(10) NOT NULL CONSTRAINT DF_ProductPrices_Currency DEFAULT N'VND',
  effectiveFrom DATE NOT NULL,
  effectiveTo DATE NULL,
  isActive BIT NOT NULL CONSTRAINT DF_ProductPrices_Active DEFAULT (1),
  CONSTRAINT FK_PP_Product FOREIGN KEY (productId) REFERENCES dbo.Products(id) ON DELETE CASCADE
);
GO
CREATE INDEX IX_ProductPrices_Active ON dbo.ProductPrices (productId, isActive, effectiveFrom);
GO
CREATE UNIQUE INDEX UX_ProductPrices_OneActive
ON dbo.ProductPrices(productId)
WHERE isActive = 1;
GO

CREATE TABLE dbo.DiscountPolicies (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_DiscountPolicies PRIMARY KEY,
  name NVARCHAR(160) NOT NULL,
  policyType NVARCHAR(20) NOT NULL,
  buyQty INT NULL,
  freeQty INT NULL,
  percentOff DECIMAL(5,2) NULL,
  minQty INT NULL,
  description NVARCHAR(MAX) NULL,
  active BIT NOT NULL CONSTRAINT DF_DiscountPolicies_Active DEFAULT (1),
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_DiscountPolicies_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_DiscountPolicies_Type CHECK (policyType IN (N'Bulk', N'Combo', N'Percent', N'Fixed'))
);
GO

-- ==================
-- Marketing/Campaigns & KPI
-- ==================

CREATE TABLE dbo.Campaigns (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Campaigns PRIMARY KEY,
  name NVARCHAR(160) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NULL,
  description NVARCHAR(MAX) NULL,
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_Campaigns_Created DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.WeeklyTargets (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_WeeklyTargets PRIMARY KEY,
  campaignId INT NOT NULL,
  weekNumber INT NOT NULL,
  primaryActivity NVARCHAR(255) NULL,
  projectedOrders INT NULL,
  projectedRevenueVnd INT NULL,
  projectedTrialUsers INT NULL,
  projectedReach INT NULL,
  projectedTraffic INT NULL,
  projectedFeedback INT NULL,
  notes NVARCHAR(MAX) NULL,
  CONSTRAINT UQ_WeeklyTargets_CampaignWeek UNIQUE (campaignId, weekNumber),
  CONSTRAINT FK_WT_Campaign FOREIGN KEY (campaignId) REFERENCES dbo.Campaigns(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.MarketingChannels (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_MarketingChannels PRIMARY KEY,
  name NVARCHAR(120) NOT NULL,
  channelType NVARCHAR(20) NOT NULL CONSTRAINT DF_MarketingChannels_Type DEFAULT N'Other',
  url NVARCHAR(512) NULL, -- link kênh (không phải ảnh)
  logoData VARBINARY(MAX) NULL,      -- ảnh logo lưu nhị phân
  logoMimeType NVARCHAR(100) NULL,   -- ví dụ: image/png
  notes NVARCHAR(MAX) NULL,
  CONSTRAINT UQ_MarketingChannels_Name UNIQUE (name),
  CONSTRAINT CK_MarketingChannels_Type CHECK (channelType IN (N'Social', N'Event', N'Partner', N'Website', N'Wom', N'Ads', N'Other'))
);
GO

CREATE TABLE dbo.ContentPosts (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContentPosts PRIMARY KEY,
  channelId INT NOT NULL,
  title NVARCHAR(200) NOT NULL,
  content NVARCHAR(MAX) NULL,
  postDate DATETIME2(3) NOT NULL,
  url NVARCHAR(512) NULL,            -- link bài post nếu có
  imageData VARBINARY(MAX) NULL,     -- ảnh chính của post
  imageMimeType NVARCHAR(100) NULL,
  views INT NULL,
  reach INT NULL,
  likes INT NULL,
  comments INT NULL,
  shares INT NULL,
  CONSTRAINT FK_CP_Channel FOREIGN KEY (channelId) REFERENCES dbo.MarketingChannels(id) ON DELETE CASCADE
);
GO
CREATE INDEX IX_ContentPosts_Date ON dbo.ContentPosts (postDate);
GO

CREATE TABLE dbo.Events (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Events PRIMARY KEY,
  campaignId INT NULL,
  name NVARCHAR(200) NOT NULL,
  eventType NVARCHAR(20) NOT NULL CONSTRAINT DF_Events_Type DEFAULT N'Other',
  startDatetime DATETIME2(3) NOT NULL,
  endDatetime DATETIME2(3) NULL,
  location NVARCHAR(255) NULL,
  description NVARCHAR(MAX) NULL,
  imageData VARBINARY(MAX) NULL,     -- poster/ảnh sự kiện
  imageMimeType NVARCHAR(100) NULL,
  CONSTRAINT FK_Ev_Campaign FOREIGN KEY (campaignId) REFERENCES dbo.Campaigns(id) ON DELETE SET NULL,
  CONSTRAINT CK_Events_Type CHECK (eventType IN (N'Workshop', N'Livestream', N'Offline_Event', N'Other'))
);
GO
CREATE INDEX IX_Events_Start ON dbo.Events (startDatetime);
GO

CREATE TABLE dbo.KpiDefinitions (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_KpiDefinitions PRIMARY KEY,
  code NVARCHAR(50) NOT NULL CONSTRAINT UQ_KpiDefinitions_Code UNIQUE,
  name NVARCHAR(160) NOT NULL,
  unit NVARCHAR(40) NULL,
  description NVARCHAR(MAX) NULL
);
GO

CREATE TABLE dbo.KpiMeasurements (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_KpiMeasurements PRIMARY KEY,
  kpiId INT NOT NULL,
  campaignId INT NULL,
  measureDate DATE NOT NULL,
  weekNumber INT NULL,
  value DECIMAL(18,2) NOT NULL,
  notes NVARCHAR(MAX) NULL,
  CONSTRAINT FK_KM_Kpi FOREIGN KEY (kpiId) REFERENCES dbo.KpiDefinitions(id) ON DELETE CASCADE,
  CONSTRAINT FK_KM_Campaign FOREIGN KEY (campaignId) REFERENCES dbo.Campaigns(id) ON DELETE SET NULL,
  CONSTRAINT CK_Kpi_Value_NonNeg CHECK (value >= 0)
);
GO
CREATE INDEX IX_KpiMeasurements_Date ON dbo.KpiMeasurements (measureDate);
GO

CREATE TABLE dbo.SurveyStats (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SurveyStats PRIMARY KEY,
  dimension NVARCHAR(60) NOT NULL,
  optionLabel NVARCHAR(120) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  sampleSize INT NULL,
  source NVARCHAR(255) NULL,
  collectedOn DATE NULL,
  CONSTRAINT UQ_Survey UNIQUE (dimension, optionLabel),
  CONSTRAINT CK_Survey_Dimension CHECK (dimension IN (N'Gender', N'Age', N'Occupation', N'Info_Channel', N'Awareness_Source', N'B2B_Promo_Preference'))
);
GO

-- ==================
-- People, Tasks, Sales
-- ==================

CREATE TABLE dbo.TeamMembers (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_TeamMembers PRIMARY KEY,
  fullName NVARCHAR(160) NOT NULL,
  title NVARCHAR(160) NOT NULL,
  responsibilities NVARCHAR(MAX) NULL,
  email NVARCHAR(160) NULL,
  phone NVARCHAR(40) NULL
);
GO

CREATE TABLE dbo.Tasks (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Tasks PRIMARY KEY,
  title NVARCHAR(200) NOT NULL,
  ownerId INT NULL,
  status NVARCHAR(20) NOT NULL CONSTRAINT DF_Tasks_Status DEFAULT N'Todo',
  category NVARCHAR(20) NOT NULL CONSTRAINT DF_Tasks_Category DEFAULT N'Other',
  dueDate DATE NULL,
  details NVARCHAR(MAX) NULL,
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_Tasks_Created DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Tasks_Updated DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Task_Owner FOREIGN KEY (ownerId) REFERENCES dbo.TeamMembers(id) ON DELETE SET NULL,
  CONSTRAINT CK_Tasks_Status CHECK (status IN (N'Todo', N'In_Progress', N'Done', N'Blocked')),
  CONSTRAINT CK_Tasks_Category CHECK (category IN (N'Marketing', N'Production', N'Sales', N'Logistics', N'Website', N'Other'))
);
GO

CREATE TABLE dbo.Customers (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Customers PRIMARY KEY,
  name NVARCHAR(160) NOT NULL,
  email NVARCHAR(160) NULL,
  phone NVARCHAR(40) NULL,
  customerType NVARCHAR(20) NOT NULL CONSTRAINT DF_Customers_Type DEFAULT N'Individual',
  gender NVARCHAR(10) NOT NULL CONSTRAINT DF_Customers_Gender DEFAULT N'Unknown',
  ageGroup NVARCHAR(10) NOT NULL CONSTRAINT DF_Customers_Age DEFAULT N'Unknown',
  sourceChannel NVARCHAR(20) NOT NULL CONSTRAINT DF_Customers_Source DEFAULT N'Other',
  address NVARCHAR(255) NULL,
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_Customers_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_Customers_Type CHECK (customerType IN (N'Individual', N'Business')),
  CONSTRAINT CK_Customers_Gender CHECK (gender IN (N'Female', N'Male', N'Other', N'Unknown')),
  CONSTRAINT CK_Customers_Age CHECK (ageGroup IN (N'18-24', N'25-34', N'35-44', N'45-54', N'55+', N'Unknown')),
  CONSTRAINT CK_Customers_Source CHECK (sourceChannel IN (N'Social', N'Wom', N'Partner', N'Ads', N'Website', N'Other'))
);
GO

CREATE TABLE dbo.Orders (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Orders PRIMARY KEY,
  orderDate DATETIME2(3) NOT NULL CONSTRAINT DF_Orders_Date DEFAULT SYSUTCDATETIME(),
  customerId INT NULL,
  channel NVARCHAR(20) NOT NULL CONSTRAINT DF_Orders_Channel DEFAULT N'Website',
  discountPolicyId INT NULL,
  totalAmountVnd INT NOT NULL CONSTRAINT DF_Orders_Total DEFAULT (0),
  status NVARCHAR(20) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT N'Pending',
  CONSTRAINT FK_Orders_Customer FOREIGN KEY (customerId) REFERENCES dbo.Customers(id) ON DELETE SET NULL,
  CONSTRAINT FK_Orders_Discount FOREIGN KEY (discountPolicyId) REFERENCES dbo.DiscountPolicies(id) ON DELETE SET NULL,
  CONSTRAINT CK_Orders_Channel CHECK (channel IN (N'Website', N'Social', N'Partner', N'Event', N'Other')),
  CONSTRAINT CK_Orders_Status CHECK (status IN (N'Pending', N'Confirmed', N'Paid', N'Shipping', N'Completed', N'Canceled')),
  CONSTRAINT CK_Orders_Total_NonNeg CHECK (totalAmountVnd >= 0)
);
GO
CREATE INDEX IX_Orders_Date ON dbo.Orders (orderDate);
GO
CREATE INDEX IX_Orders_Customer ON dbo.Orders(customerId, orderDate DESC);
GO
CREATE INDEX IX_Orders_Status_Date ON dbo.Orders(status, orderDate DESC);
GO

CREATE TABLE dbo.OrderItems (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderItems PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  unitPriceVnd INT NOT NULL,
  lineTotalVnd AS (quantity * unitPriceVnd) PERSISTED,
  CONSTRAINT FK_OI_Order FOREIGN KEY (orderId) REFERENCES dbo.Orders(id) ON DELETE CASCADE,
  CONSTRAINT FK_OI_Product FOREIGN KEY (productId) REFERENCES dbo.Products(id) ON DELETE NO ACTION,
  CONSTRAINT CK_OI_Qty_Pos CHECK (quantity > 0),
  CONSTRAINT CK_OI_Price_NonNeg CHECK (unitPriceVnd >= 0)
);
GO
CREATE INDEX IX_OrderItems_Order ON dbo.OrderItems (orderId);
GO
CREATE INDEX IX_OrderItems_Product ON dbo.OrderItems (productId);
GO

CREATE TABLE dbo.Feedback (
  id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Feedback PRIMARY KEY,
  customerId INT NULL,
  orderId INT NULL,
  rating TINYINT NOT NULL,
  comment NVARCHAR(MAX) NULL,
  channel NVARCHAR(20) NOT NULL CONSTRAINT DF_Feedback_Channel DEFAULT N'Website',
  createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_Feedback_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_Feedback_Rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT CK_Feedback_Channel CHECK (channel IN (N'Website', N'Social', N'Partner', N'Event', N'Other')),
  CONSTRAINT FK_FB_Customer FOREIGN KEY (customerId) REFERENCES dbo.Customers(id) ON DELETE SET NULL,
  CONSTRAINT FK_FB_Order FOREIGN KEY (orderId) REFERENCES dbo.Orders(id) ON DELETE SET NULL
);
GO
CREATE INDEX IX_Feedback_Customer ON dbo.Feedback(customerId, createdAt DESC);
GO

CREATE INDEX IX_PI_Ingredient ON dbo.ProductIngredients(ingredientId);
GO

-- ==================
-- View
-- ==================
CREATE OR ALTER VIEW dbo.vw_ProductsWithActivePrice AS
SELECT p.id, p.name, p.description, p.origin, p.status,
       ap.priceVnd, ap.currency
FROM dbo.Products p
LEFT JOIN dbo.ProductPrices ap
  ON ap.productId = p.id AND ap.isActive = 1;
GO

-- ==================
-- Trigger: recalc order totals
-- ==================
CREATE OR ALTER TRIGGER dbo.trg_Orders_Recalc ON dbo.OrderItems
AFTER INSERT, UPDATE, DELETE AS
BEGIN
  SET NOCOUNT ON;
  ;WITH A AS (
    SELECT DISTINCT orderId FROM inserted
    UNION
    SELECT DISTINCT orderId FROM deleted
  )
  UPDATE o
  SET totalAmountVnd = ISNULL(x.sumTotal, 0)
  FROM dbo.Orders o
  JOIN A ON A.orderId = o.id
  OUTER APPLY (
    SELECT SUM(quantity * unitPriceVnd) AS sumTotal
    FROM dbo.OrderItems oi
    WHERE oi.orderId = o.id
  ) x;
END;
GO

-- ==================
-- Seed Data (ảnh để NULL, có thể INSERT bằng VARBINARY sau)
-- ==================

INSERT INTO dbo.Products (name, description, origin, status)
VALUES (N'LePina', N'Thuốc trừ sâu sinh học chiết xuất từ trái cây (enzyme, acid hữu cơ). Hiệu quả thấy rõ sau 5–7 ngày, giảm 40–60% mật độ sâu bệnh.', N'Chiết xuất từ chanh và dứa; thân thiện môi trường', N'Testing');

INSERT INTO dbo.Ingredients (name, kind, notes) VALUES
(N'Chanh', N'Fruit', N'Nguồn acid hữu cơ và mùi hương dễ chịu'),
(N'Dứa', N'Fruit', N'Nguồn enzyme tự nhiên');

INSERT INTO dbo.ProductIngredients (productId, ingredientId, [percent], notes)
SELECT p.id, i.id, NULL, N'Thành phần tự nhiên'
FROM dbo.Products p
JOIN dbo.Ingredients i ON i.name IN (N'Chanh', N'Dứa')
WHERE p.name = N'LePina';

INSERT INTO dbo.ProductPrices (productId, priceVnd, currency, effectiveFrom, isActive)
SELECT id, 90000, N'VND', CONVERT(date,'2025-10-01'), 1 FROM dbo.Products WHERE name = N'LePina';

INSERT INTO dbo.DiscountPolicies (name, policyType, buyQty, freeQty, percentOff, minQty, description, active)
VALUES
(N'Combo 5 tặng 1', N'Combo', 5, 1, NULL, 6, N'Mua 5 tặng 1; đơn giá thực tế trung bình ~85.000đ/chai', 1),
(N'Giảm giá B2B số lượng lớn', N'Bulk', NULL, NULL, 10.00, 50, N'Chiết khấu mua số lượng cho đối tác/nhà phân phối', 1);

INSERT INTO dbo.Campaigns (name, startDate, endDate, description)
VALUES (N'MVP Launch Oct–Dec 2025', '2025-10-01', '2025-12-31', N'Ra mắt sản phẩm, livestream, ads nhỏ, event offline, tổng kết chiến dịch');

INSERT INTO dbo.WeeklyTargets (
  campaignId, weekNumber, primaryActivity, projectedOrders, projectedRevenueVnd,
  projectedTrialUsers, projectedReach, projectedTraffic, projectedFeedback, notes
)
SELECT c.id, t.weekNumber, t.primaryActivity, t.orders, t.revenue, t.trialUsers, t.reach, t.traffic, t.feedback, t.note
FROM dbo.Campaigns c
CROSS APPLY (VALUES
  (3, N'Ra mắt sản phẩm, minigame, post đầu tiên', 40,  3400000,  70, 1000,  400,  5,  N'Tăng nhận diện ban đầu'),
  (4, N'Livestream thử sản phẩm, review',            80,  6800000, 120, 2000, 1000, 10, N'Tập trung awareness'),
  (5, N'Chạy ads nhỏ, mở bán combo',                100,  8500000, 180, 3000, 2000, 20, N'Chuyển đổi mua thử'),
  (6, N'Event offline tại quán đối tác',            120, 10200000, 220, 3500, 3000, 30, N'Tăng trải nghiệm thực tế'),
  (7, N'Tăng lượt review, content khách hàng',      130, 11050000, 260, 4000, 3500, 40, N'Duy trì tương tác'),
  (8, N'Tổng kết chiến dịch',                       150, 12750000, 350, 5000, 5000, 50, N'Chuẩn bị giai đoạn mở rộng')
) AS t(weekNumber, primaryActivity, orders, revenue, trialUsers, reach, traffic, feedback, note)
WHERE c.name = N'MVP Launch Oct–Dec 2025';

INSERT INTO dbo.KpiDefinitions (code, name, unit, description) VALUES
(N'orders', N'Số đơn hàng', N'đơn', N'Tổng số đơn theo ngày/tuần'),
(N'revenue', N'Doanh thu', N'VND', N'Tổng doanh thu'),
(N'trial_users', N'Người dùng thử', N'người', N'Số người dùng thử nghiệm'),
(N'reach', N'Lượt tiếp cận', N'lượt', N'Chỉ số reach trên mạng xã hội'),
(N'engagement', N'Tương tác', N'lượt', N'Like/Share/Comment tổng'),
(N'feedback', N'Phản hồi', N'lượt', N'Số feedback nhận được'),
(N'satisfaction', N'Mức độ hài lòng', N'%', N'Tỷ lệ đánh giá 4★+'),
(N'repeat_rate', N'Tỷ lệ mua lại', N'%', N'Tỷ lệ khách quay lại');

INSERT INTO dbo.MarketingChannels (name, channelType, url, notes)
VALUES
(N'Facebook', N'Social', NULL, N'Kênh mạng xã hội chủ lực'),
(N'TikTok', N'Social', NULL, N'Video ngắn'),
(N'Website/E-commerce', N'Website', NULL, N'Kênh bán trực tuyến'),
(N'Livestream', N'Event', NULL, N'Sự kiện livestream'),
(N'Workshop/Offline', N'Event', NULL, N'Sự kiện đào tạo trực tiếp'),
(N'Word-of-Mouth', N'Wom', NULL, N'Truyền miệng'),
(N'Partners', N'Partner', NULL, N'Chuyên gia/đối tác nông nghiệp');

INSERT INTO dbo.SurveyStats (dimension, optionLabel, percentage, sampleSize, source, collectedOn) VALUES
(N'Gender', N'Female', 49.20, NULL, N'Internal Survey', '2025-09-30'),
(N'Age', N'25–34', 43.10, NULL, N'Internal Survey', '2025-09-30'),
(N'Occupation', N'Chủ doanh nghiệp/Người bán hàng', 37.70, NULL, N'Internal Survey', '2025-09-30'),
(N'Info_Channel', N'Mạng xã hội', 99.20, NULL, N'Internal Survey', '2025-09-30'),
(N'Awareness_Source', N'Truyền miệng', 89.20, NULL, N'Internal Survey', '2025-09-30'),
(N'B2B_Promo_Preference', N'Bulk Purchase Discount', 90.00, NULL, N'Internal Survey', '2025-09-30');
