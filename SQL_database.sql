
-- TRAVEL MANAGEMENT SYSTEM DATABASE  
create database TRAVELMANAGEMENTSYSTEM
use TRAVELMANAGEMENTSYSTEM


-- Departments Table 
CREATE TABLE departments (department_id VARCHAR(10) PRIMARY KEY,department_name VARCHAR(50) NOT NULL)

-- Employees Table
CREATE TABLE employees (
    id VARCHAR(50) PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    department_id VARCHAR(10),
    project_id VARCHAR(20) NOT NULL,
    date_of_join DATE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'manager')),
    designation VARCHAR(100),
    created_date DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
)

-- Travel Requests Table
CREATE TABLE travel_requests (
    id VARCHAR(50) PRIMARY KEY,
    from_city VARCHAR(100) NOT NULL,
    to_city VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    purpose NVARCHAR(MAX) NOT NULL, 
    cost DECIMAL(12, 2) NOT NULL CHECK (cost >= 0),
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('plane', 'car', 'train')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    employee_id VARCHAR(20) NOT NULL,
    project_id VARCHAR(20) NOT NULL,
    is_deleted BIT NOT NULL DEFAULT 0, 
    remark NVARCHAR(MAX),
    action_date DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_request_employee FOREIGN KEY (employee_id)  REFERENCES employees(employee_id) ON DELETE CASCADE, CONSTRAINT chk_date_sanity CHECK (end_date >= start_date)
)


--  INDEX

-- Speeds up  profile matching during login 
CREATE INDEX idx_employees_email ON employees(email)

-- Speeds up Employee Dashboard filtering 
CREATE INDEX idx_requests_employee_dashboard  ON travel_requests(employee_id, is_deleted, status)

-- Speeds up Manager Dashboard loading 
CREATE INDEX idx_requests_manager_dashboard  ON travel_requests(project_id, is_deleted, status)

-- ── 3. VIEWS 

-- Secure View for  Profile Excludes  passwords
CREATE OR ALTER VIEW view_employee_profiles AS
SELECT 
    e.employee_id,
    e.employee_name,
    e.email,
    e.project_id,
    e.designation,
    d.department_name,
    e.role
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id


-- ── 4. STORED PROCEDURES 

-- submit a new Travel Request
CREATE OR ALTER PROCEDURE sp_add_travel_request
    @p_id VARCHAR(50),@p_from VARCHAR(100),@p_to VARCHAR(100),
    @p_start_date DATE,@p_end_date DATE,@p_purpose NVARCHAR(MAX),
    @p_cost DECIMAL(12,2),@p_mode VARCHAR(20),@p_employee_id VARCHAR(20),@p_project_id VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON
    IF @p_end_date < @p_start_date
    BEGIN
        RAISERROR('End date cannot be before start date.', 16, 1)
        RETURN
    END

    INSERT INTO travel_requests (id, from_city, to_city, start_date, end_date, purpose, cost, mode, status, employee_id, project_id, is_deleted) 
    VALUES (@p_id, @p_from, @p_to, @p_start_date, @p_end_date, @p_purpose, @p_cost, ISNULL(@p_mode, 'plane'), 'pending', @p_employee_id, @p_project_id, 0)
END



--  Managers to Approve/Reject
CREATE OR ALTER PROCEDURE sp_action_travel_request @p_request_id VARCHAR(50), @p_status VARCHAR(20), @p_remark NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON

    --  Manager explanation  can't be blank
    IF @p_remark IS NULL OR TRIM(@p_remark) = ''
    BEGIN
        RAISERROR('A decision remark statement is required.', 16, 1)
        RETURN
    END

    IF @p_status NOT IN ('accepted', 'rejected')
    BEGIN
        RAISERROR('Invalid status change option provided.', 16, 1)
        RETURN
    END

    UPDATE travel_requests
    SET status = @p_status,remark = @p_remark,action_date = GETDATE()
    WHERE id = @p_request_id AND is_deleted = 0
END




--  Department map
INSERT INTO departments (department_id, department_name) VALUES 
('1', 'IT'),('2', 'Marketing'),('3', 'Finance')

--  IT Manager (PRJ0001)
INSERT INTO employees (id, employee_name, employee_id, email, password, department_id, project_id, date_of_join, role, designation) VALUES 
('mgr-it-1', 'Amir', 'MGR0001', 'amir.mgr@gmail.com', 'Manager@123', '1', 'PRJ0001', '2020-01-01', 'manager', 'IT Project Lead'),
('emp-it-1', 'Monisha', 'ST26302', 'monisha@gmail.com', 'Moni1805@', '1', 'PRJ0001', '2026-03-16', 'employee', 'Software Engineer')

