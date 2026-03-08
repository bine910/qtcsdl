-- Enable Mixed Mode (also via T-SQL)
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2;

-- Create login if not exists
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'cloth_user')
BEGIN
    CREATE LOGIN [cloth_user] WITH PASSWORD = '123456', DEFAULT_DATABASE = [ClothShopDB], CHECK_POLICY = OFF;
    PRINT 'Login cloth_user created';
END
ELSE
BEGIN
    -- Reset password and enable
    ALTER LOGIN [cloth_user] WITH PASSWORD = '123456';
    ALTER LOGIN [cloth_user] ENABLE;
    PRINT 'Login cloth_user already exists, password reset and enabled';
END

-- Grant access to ClothShopDB
USE [ClothShopDB];
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'cloth_user')
BEGIN
    CREATE USER [cloth_user] FOR LOGIN [cloth_user];
    PRINT 'User cloth_user created in ClothShopDB';
END

-- Grant db_owner role
ALTER ROLE db_owner ADD MEMBER [cloth_user];
PRINT 'cloth_user added to db_owner role';
GO
