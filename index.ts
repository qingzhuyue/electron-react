/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-07-13 23:30:33
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-13 23:41:58
 * @FilePath: /vite-electron-react/index.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {
  let result: number[] = [];
  let i: number = 0, j: number = 0;

  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }

  while(i<nums1.length){
    result.push(nums1[i]);
    i++;
  }
  while(j<nums2.length){
    result.push(nums2[j]);
    j++;
  }

  return result
};

console.log(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3))