import Question from './models/questionModel';

/*
   {
      questionId: 6,
      title: 'Implement Stack using Queues',
      description: `Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).`,
      categories: 'Data Structures',
      complexity: 'Easy',
    },
    {
      questionId: 7,
      title: 'Combine Two Tables',
      description: `Given table Person with the following columns: personId, lastName, firstName. And table Address with the following columns: addressId, personId, city, state. Write a solution to report the first name, last name, city, and state of each person.`,
      categories: 'Databases',
      complexity: 'Easy',
    },
    {
        questionId: 12,
        title: 'Rotate Image',
        description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).`,
        categories: 'Arrays, Algorithms',
        complexity: 'Medium',
    },
    {
        questionId: 13,
        title: 'Airplane Seat Assignment Probability',
        description: `n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. After that, the rest of the passengers will: take their own seat if it is still available, or pick other seats randomly if their seat is taken. Return the probability that the nth person gets their own seat.`,
        categories: 'Brainteaser',
        complexity: 'Medium',
    },
    {
        questionId: 19,
        title: 'Chalkboard XOR Game',
        description: `You are given an array of integers representing numbers written on a chalkboard. Alice and Bob take turns erasing exactly one number from the chalkboard. Return true if and only if Alice wins the game, assuming both players play optimally.`,
        categories: 'Brainteaser',
        complexity: 'Hard',
    },
    {
        questionId: 18,
        title: 'Wildcard Matching',
        description: `Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:
        - '?' matches any single character.
        - '*' matches any sequence of characters (including the empty sequence).
        
        The matching should cover the entire input string (not partial).`,
        categories: 'Strings, Algorithms',
        complexity: 'Hard',
    }
*/
const sampleQuestions = [
    {
      questionId: 1,
      title: 'Reverse a String',
      description: `Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.
      Example 1:
      Input: s = ["h","e","l","l","o"]
      Output: ["o","l","l","e","h"]
  
      Example 2:
      Input: s = ["H","a","n","n","a","h"]
      Output: ["h","a","n","n","a","H"]
      
      Constraints:
      1 <= s.length <= 105
      s[i] is a printable ascii character.`,
      categories: 'Strings, Algorithms',
      complexity: 'Easy',
    },
    {
      questionId: 2,
      title: 'Linked List Cycle Detection',
      description: `Implement a function to detect if a linked list contains a cycle.`,
      categories: 'Data Structures, Algorithms',
      complexity: 'Easy',
    },
    {
      questionId: 3,
      title: 'Roman to Integer',
      description: `Given a roman numeral, convert it to an integer.`,
      categories: 'Algorithms',
      complexity: 'Easy',
    },
    {
      questionId: 4,
      title: 'Add Binary',
      description: `Given two binary strings a and b, return their sum as a binary string.`,
      categories: 'Bit Manipulation, Algorithms',
      complexity: 'Easy',
    },
    {
      questionId: 5,
      title: 'Fibonacci Number',
      description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1 F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).`,
      categories: 'Recursion, Algorithms',
      complexity: 'Easy',
    },
    {
      questionId: 8,
      title: 'Repeated DNA Sequences',
      description: `Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule.`,
      categories: 'Algorithms, Bit Manipulation',
      complexity: 'Medium',
    },
    {
      questionId: 9,
      title: 'Course Schedule',
      description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.`,
      categories: 'Data Structures, Algorithms',
      complexity: 'Medium',
    },
    {
      questionId: 10,
      title: 'LRU Cache Design',
      description: `Design and implement an LRU (Least Recently Used) cache.`,
      categories: 'Data Structures',
      complexity: 'Medium',
    },
    {
        questionId: 11,
        title: 'Longest Common Subsequence',
        description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.
        
        A subsequence of a string is a new string generated from the original string with some characters deleted without changing the relative order of the remaining characters.`,
        categories: 'Strings, Algorithms',
        complexity: 'Medium',
      },
      {
        questionId: 14,
        title: 'Validate Binary Search Tree',
        description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).`,
        categories: 'Data Structures, Algorithms',
        complexity: 'Medium',
      },
      {
        questionId: 15,
        title: 'Sliding Window Maximum',
        description: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position, return the maximum sliding window.`,
        categories: 'Arrays, Algorithms',
        complexity: 'Hard',
      },
      {
        questionId: 16,
        title: 'N-Queen Problem',
        description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.`,
        categories: 'Algorithms',
        complexity: 'Hard',
      },
      {
        questionId: 17,
        title: 'Serialize and Deserialize a Binary Tree',
        description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection. Design an algorithm to serialize and deserialize a binary tree.`,
        categories: 'Data Structures, Algorithms',
        complexity: 'Hard',
      },
      {
        questionId: 20,
        title: 'Trips and Users',
        description: `Given table Trips with columns id, client_id, driver_id, city_id, status, request_at, and table Users with columns users_id, banned, role, write a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) between specific dates.`,
        categories: 'Databases',
        complexity: 'Hard',
      }
  ];

const loadSampleData = async () => {
  try {
    // Check if data already exists
    const count = await Question.countDocuments();
    if (count === 0) {
      // Insert sample data if the collection is empty
      await Question.insertMany(sampleQuestions);
      console.log('Sample data loaded');
    } else {
      console.log('Data already exists, skipping seed');
    }
  } catch (error) {
    console.error('Error loading sample data', error);
  }
};

export default loadSampleData;