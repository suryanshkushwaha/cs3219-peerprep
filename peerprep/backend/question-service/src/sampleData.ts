import { Request, Response } from 'express';
import { createQuestion } from './controllers/questionController';
import Question from './models/questionModel';

const sampleQuestions = [
  {
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
    categories: 'strings, algorithms',
    difficulty: 'easy',
    input1: '["h","e","l","l","o"]',
    output1: '["o","l","l","e","h"]',
    input2: '["H","a","n","n","a","h"]',
    output2: '["h","a","n","n","a","H"]'
  },
  {
    title: 'Linked List Cycle Detection',
    description: `Implement a function to detect if a linked list contains a cycle.`,
    categories: 'data-structures, algorithms',
    difficulty: 'easy',
    input1: 'head = [3,2,0,-4], pos = 1',
    output1: 'true',
    input2: 'head = [1,2], pos = 0',
    output2: 'true'
  },
  {
    title: 'Roman to Integer',
    description: `Given a roman numeral, convert it to an integer.`,
    categories: 'algorithms',
    difficulty: 'easy',
    input1: 'III',
    output1: '3',
    input2: 'IV',
    output2: '4'
  },
  {
    title: 'Add Binary',
    description: `Given two binary strings a and b, return their sum as a binary string.`,
    categories: 'bit-manipulation, algorithms',
    difficulty: 'easy',
    input1: 'a = "11", b = "1"',
    output1: '"100"',
    input2: 'a = "1010", b = "1011"',
    output2: '"10101"'
  },
  {
    title: 'Fibonacci Number',
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1 F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).`,
    categories: 'recursion, algorithms',
    difficulty: 'easy',
    input1: '2',
    output1: '1',
    input2: '3',
    output2: '2'
  },
  {
    title: 'Implement Stack using Queues',
    description: `Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).`,
    categories: 'data-structures',
    difficulty: 'easy',
    input1: '["MyStack", "push", "push", "top", "pop", "empty"] [[], [1], [2], [], [], []]',
    output1: '[null, null, null, 2, 2, false]',
    input2: '["MyStack", "push", "push", "push", "top", "pop", "empty"] [[], [1], [2], [3], [], [], []]',
    output2: '[null, null, null, null, 3, 3, false]'
  },
  {
    title: 'Repeated DNA Sequences',
    description: `The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.
      
      For example, "ACGAATTCCG" is a DNA sequence. When studying DNA, it is useful to identify repeated sequences within the DNA.
      
      Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in any order.`,
    categories: 'algorithms, bit-manipulation',
    difficulty: 'medium',
    input1: '"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"',
    output1: '["AAAAACCCCC","CCCCCAAAAA"]',
    input2: '"AAAAAAAAAAAAA"',
    output2: '["AAAAAAAAAA"]'
  },
  {
    title: 'Course Schedule',
    description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.
    
      For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1. Return true if you can finish all courses. Otherwise, return false.`,
    categories: 'data-structures, algorithms',
    difficulty: 'medium',
    input1: 'numCourses = 2, prerequisites = [[1,0]]',
    output1: 'true',
    input2: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
    output2: 'false'
  },
  {
    title: 'LRU Cache Design',
    description: `Design and implement an LRU (Least Recently Used) cache.`,
    categories: 'data-structures',
    difficulty: 'medium',
    input1: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
    output1: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
    input2: '["LRUCache", "put", "put", "put", "put", "get", "get"]\n[[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]]',
    output2: '[null, null, null, null, null, -1, 3]'
  },
  {
    title: 'Longest Common Subsequence',
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.
  
      A subsequence of a string is a new string generated from the original string with some characters deleted without changing the relative order of the remaining characters.
      
      For example, "ace" is a subsequence of "abcde". A common subsequence of two strings is a subsequence that is common to both strings.`,
    categories: 'strings, algorithms',
    difficulty: 'medium',
    input1: 'text1 = "abcde", text2 = "ace"',
    output1: '3',
    input2: 'text1 = "abc", text2 = "abc"',
    output2: '3'
  },
  {
    title: 'Rotate Image',
    description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).`,
    categories: 'arrays, algorithms',
    difficulty: 'medium',
    input1: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
    output1: '[[7,4,1],[8,5,2],[9,6,3]]',
    input2: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
    output2: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]'
  },
  {
    title: 'Airplane Seat Assignment Probability',
    description: `n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. But after that, the rest of the passengers will: Take their own seat if it is still available, and Pick other seats randomly when they find their seat occupied
      
      Return the probability that the nth person gets his own seat.`,
    categories: 'brainteaser',
    difficulty: 'medium',
    input1: 'n = 1',
    output1: '1.00000',
    input2: 'n = 2',
    output2: '0.50000'
  },
  {
    title: 'Validate Binary Search Tree',
    description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).`,
    categories: 'data-structures, algorithms',
    difficulty: 'medium',
    input1: '[2,1,3]',
    output1: 'true',
    input2: '[5,1,4,null,null,3,6]',
    output2: 'false'
  },
  {
    title: 'Sliding Window Maximum',
    description: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position, return the maximum sliding window.`,
    categories: 'arrays, algorithms',
    difficulty: 'hard',
    input1: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
    output1: '[3,3,5,5,6,7]',
    input2: 'nums = [1], k = 1',
    output2: '[1]'
  },
  {
    title: 'N-Queen Problem',
    description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.`,
    categories: 'algorithms',
    difficulty: 'hard',
    input1: 'n = 4',
    output1: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
    input2: 'n = 1',
    output2: '["Q"]'
  },
  {
    title: 'Serialize and Deserialize a Binary Tree',
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection. Design an algorithm to serialize and deserialize a binary tree.`,
    categories: 'data-structures, algorithms',
    difficulty: 'hard',
    input1: 'root = [1,2,3,null,null,4,5]',
    output1: '[1,2,3,null,null,4,5]',
    input2: 'root = []',
    output2: '[]'
  },
  {
    title: 'Wildcard Matching',
    description: `Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:
      
      '?' Matches any single character. '*' Matches any sequence of characters (including the empty sequence). The matching should cover the entire input string (not partial).`,
    categories: 'strings, algorithms',
    difficulty: 'hard',
    input1: 's = "aa", p = "a"',
    output1: 'false',
    input2: 's = "adceb", p = "*a*b"',
    output2: 'true'
  },
  {
    title: 'Chalkboard XOR Game',
    description: `You are given an array of integers nums represents the numbers written on a chalkboard.
      
      Alice and Bob take turns erasing exactly one number from the chalkboard, with Alice starting first. If erasing a number causes the bitwise XOR of all the elements of the chalkboard to become 0, then that player loses. The bitwise XOR of one element is that element itself, and the bitwise XOR of no elements is 0.
      
      Also, if any player starts their turn with the bitwise XOR of all the elements of the chalkboard equal to 0, then that player wins.
      
      Return true if and only if Alice wins the game, assuming both players play optimally.`,
    categories: 'brainteaser',
    difficulty: 'hard',
    input1: 'nums = [1,1,2]',
    output1: 'false',
    input2: 'nums = [0,1]',
    output2: 'true'
  }
];

// Create a helper function to simulate the Express request-response cycle
const simulateCreateQuestion = async (question: any) => {
  return new Promise((resolve, reject) => {
    // Simulating the request object
    const req = {
      body: question,
    } as Request;

    // Simulating the response object
    const res = {
      status: (code: number) => {
        return {
          json: (data: any) => {
            if (code === 201) {
              resolve(data); // Successfully created question
            } else {
              reject(data); // Handle error response
            }
          },
        };
      },
    } as Response;

    createQuestion(req, res);
  });
};

const loadSampleData = async () => {
  try {
    // Check if data already exists
    const count = await Question.countDocuments();
    if (count === 0) {
      // Insert sample data if the collection is empty
      for (const question of sampleQuestions) {
        await simulateCreateQuestion(question);
      }
      console.log('Sample data loaded');
    } else {
      console.log('Data already exists, skipping seed');
    }
  } catch (error) {
    console.error('Error loading sample data', error);
  }
};

export default loadSampleData;