import { useState } from 'react';
import { analyzeCode } from '../api/client';
import { Code2, Loader2, Play, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeAnalyzer = ({ onAnalysisComplete, initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [autoFix, setAutoFix] = useState(false);

  // ============================================================
  // ২১টি ভাষার সম্পূর্ণ তালিকা
  // ============================================================
  const languages = [
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '⚡' },
    { value: 'typescript', label: 'TypeScript', icon: '📘' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚙️' },
    { value: 'csharp', label: 'C#', icon: '🔷' },
    { value: 'ruby', label: 'Ruby', icon: '💎' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'swift', label: 'Swift', icon: '🦅' },
    { value: 'kotlin', label: 'Kotlin', icon: '📱' },
    { value: 'dart', label: 'Dart', icon: '🎯' },
    { value: 'r', label: 'R', icon: '📊' },
    { value: 'scala', label: 'Scala', icon: '🔺' },
    { value: 'perl', label: 'Perl', icon: '🐪' },
    { value: 'haskell', label: 'Haskell', icon: 'λ' },
    { value: 'clojure', label: 'Clojure', icon: '🧪' },
    { value: 'elixir', label: 'Elixir', icon: '💧' },
    { value: 'erlang', label: 'Erlang', icon: '🔵' },
    { value: 'shell', label: 'Shell', icon: '💻' }
  ];

  const sampleCode = {
    python: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

nums = [10, 20, 30, 40]
result = calculate_average(nums)
print(f"Average: {result}")`,

    javascript: `function calculateAverage(numbers) {
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    return total / numbers.length;
}

const nums = [10, 20, 30, 40];
const result = calculateAverage(nums);
console.log("Average: " + result);`,

    cpp: `#include <iostream>
#include <vector>
using namespace std;

double calculateAverage(vector<int> numbers) {
    int total = 0;
    for (int i = 0; i < numbers.size(); i++) {
        total += numbers[i];
    }
    return (double)total / numbers.size();
}

int main() {
    vector<int> nums = {10, 20, 30, 40};
    double result = calculateAverage(nums);
    cout << "Average: " << result << endl;
    return 0;
}`,

    java: `public class Main {
    public static double calculateAverage(int[] numbers) {
        int total = 0;
        for (int i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
        return (double) total / numbers.length;
    }

    public static void main(String[] args) {
        int[] nums = {10, 20, 30, 40};
        double result = calculateAverage(nums);
        System.out.println("Average: " + result);
    }
}`,

    csharp: `using System;

class Program {
    static double CalculateAverage(int[] numbers) {
        int total = 0;
        for (int i = 0; i < numbers.Length; i++) {
            total += numbers[i];
        }
        return (double)total / numbers.Length;
    }

    static void Main() {
        int[] nums = {10, 20, 30, 40};
        double result = CalculateAverage(nums);
        Console.WriteLine("Average: " + result);
    }
}`,

    ruby: `def calculate_average(numbers)
    total = 0
    numbers.each do |num|
        total += num
    end
    total.to_f / numbers.length
end

nums = [10, 20, 30, 40]
result = calculate_average(nums)
puts "Average: #{result}"`,

    go: `package main

import "fmt"

func calculateAverage(numbers []int) float64 {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return float64(total) / float64(len(numbers))
}

func main() {
    nums := []int{10, 20, 30, 40}
    result := calculateAverage(nums)
    fmt.Printf("Average: %.2f\\n", result)
}`,

    rust: `fn calculate_average(numbers: &[i32]) -> f64 {
    let total: i32 = numbers.iter().sum();
    total as f64 / numbers.len() as f64
}

fn main() {
    let nums = vec![10, 20, 30, 40];
    let result = calculate_average(&nums);
    println!("Average: {}", result);
}`,

    php: `<?php
function calculateAverage($numbers) {
    $total = 0;
    foreach ($numbers as $num) {
        $total += $num;
    }
    return $total / count($numbers);
}

$nums = [10, 20, 30, 40];
$result = calculateAverage($nums);
echo "Average: " . $result;
?>`,

    swift: `func calculateAverage(_ numbers: [Int]) -> Double {
    let total = numbers.reduce(0, +)
    return Double(total) / Double(numbers.count)
}

let nums = [10, 20, 30, 40]
let result = calculateAverage(nums)
print("Average: \\(result)")`,

    kotlin: `fun calculateAverage(numbers: IntArray): Double {
    val total = numbers.sum()
    return total.toDouble() / numbers.size.toDouble()
}

fun main() {
    val nums = intArrayOf(10, 20, 30, 40)
    val result = calculateAverage(nums)
    println("Average: $result")
}`,

    dart: `double calculateAverage(List<int> numbers) {
    int total = 0;
    for (int num in numbers) {
        total += num;
    }
    return total / numbers.length;
}

void main() {
    List<int> nums = [10, 20, 30, 40];
    double result = calculateAverage(nums);
    print("Average: $result");
}`,

    r: `calculate_average <- function(numbers) {
    total <- sum(numbers)
    return(total / length(numbers))
}

nums <- c(10, 20, 30, 40)
result <- calculate_average(nums)
print(paste("Average:", result))`,

    scala: `object Main {
    def calculateAverage(numbers: Array[Int]): Double = {
        val total = numbers.sum
        total.toDouble / numbers.length.toDouble
    }

    def main(args: Array[String]): Unit = {
        val nums = Array(10, 20, 30, 40)
        val result = calculateAverage(nums)
        println(s"Average: $result")
    }
}`,

    perl: `sub calculate_average {
    my @numbers = @_;
    my $total = 0;
    foreach my $num (@numbers) {
        $total += $num;
    }
    return $total / scalar @numbers;
}

my @nums = (10, 20, 30, 40);
my $result = calculate_average(@nums);
print "Average: $result\\n";`,

    haskell: `calculateAverage :: [Int] -> Double
calculateAverage numbers = fromIntegral (sum numbers) / fromIntegral (length numbers)

main :: IO ()
main = do
    let nums = [10, 20, 30, 40]
    let result = calculateAverage nums
    putStrLn $ "Average: " ++ show result`,

    clojure: `(defn calculate-average [numbers]
    (/ (reduce + numbers) (count numbers)))

(def nums [10 20 30 40])
(def result (calculate-average nums))
(println (str "Average: " result))`,

    elixir: `defmodule Calculator do
    def calculate_average(numbers) do
        total = Enum.sum(numbers)
        total / length(numbers)
    end
end

nums = [10, 20, 30, 40]
result = Calculator.calculate_average(nums)
IO.puts("Average: #{result}")`,

    erlang: `-module(calculator).
-export([calculate_average/1]).

calculate_average(Numbers) ->
    Total = lists:sum(Numbers),
    Total / length(Numbers).

main() ->
    Nums = [10, 20, 30, 40],
    Result = calculate_average(Nums),
    io:format("Average: ~p~n", [Result]).`,

    shell: `#!/bin/bash

calculate_average() {
    local total=0
    local count=0
    for num in "$@"; do
        total=$((total + num))
        count=$((count + 1))
    done
    echo "scale=2; $total / $count" | bc
}

nums=(10 20 30 40)
result=$(calculate_average "${nums[@]}")
echo "Average: $result"`
  };

  const loadSample = () => {
    setCode(sampleCode[language] || '');
    toast.success('✨ Sample code loaded!');
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please paste some code to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeCode(code, language, autoFix);
      onAnalysisComplete(result);
      
      const count = result.issues?.length || 0;
      if (count === 0) {
        toast.success('✨ Perfect code! No issues found!');
      } else {
        toast.success(`🔍 Found ${count} issue(s)`);
      }
    } catch (error) {
      toast.error('Analysis failed. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Code2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Code Analyzer</h2>
            <p className="text-sm text-gray-500">AI-powered code review with auto-fix</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {/* Language Selector - 21 Languages */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language ({languages.length})
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end gap-2">
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Sample
          </button>
        </div>
      </div>

      {/* Auto-fix toggle */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="autoFix"
          checked={autoFix}
          onChange={(e) => setAutoFix(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="autoFix" className="text-sm text-gray-700 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-600" />
          Auto-fix issues
        </label>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Paste your ${language} code here...`}
        className="w-full h-80 p-4 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
        spellCheck={false}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !code.trim()}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Code2 className="w-5 h-5" />
            {autoFix ? 'Analyze & Fix' : 'Analyze Code'}
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 mt-3 text-center">
        {autoFix ? '🔧 Auto-fix will generate corrected code' : '🔍 Static + AI analysis for comprehensive review'}
      </p>
    </div>
  );
};

export default CodeAnalyzer;