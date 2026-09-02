CREATE DATABASE IF NOT EXISTS codehub_db;
USE codehub_db;

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section ENUM('DSA', 'CPP') NOT NULL,
    topic VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    category ENUM('Classwork', 'Homework') DEFAULT 'Classwork',
    problem_statement TEXT NOT NULL,
    solution_code TEXT,
    solution_explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
INSERT INTO questions (section, topic, title, difficulty, category, problem_statement, solution_code, solution_explanation)
VALUES 
('DSA', 'Arrays', 'Two Sum', 'Easy', 'Classwork', 
 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 
 '#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    for(int i = 0; i < nums.size(); ++i) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) return {seen[comp], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}', 
 'Use a hash map to track the complement value ($target - nums[i]$) as you iterate through the array in O(n) time.'),

('CPP', 'OOP', 'Demonstrating Pure Virtual Functions', 'Medium', 'Homework', 
 'Write an abstract class Shape with a pure virtual method area() and implement it in a derived class Rectangle.', 
 '#include <iostream>\n\nclass Shape {\npublic:\n    virtual double area() const = 0;\n};\n\nclass Rectangle : public Shape {\n    double w, h;\npublic:\n    Rectangle(double w, double h) : w(w), h(h) {}\n    double area() const override { return w * h; }\n};', 
 'Declaring a virtual method with `= 0` makes the class abstract, enforcing derived implementations.');