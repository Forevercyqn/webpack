import  './main.css'
import './exact.less'
import logo from '../public/logo.png'
import Person from './test'
import $ from 'jquery'

const a = '20211027';
console.log(a)

const img = new Image()
img.src = logo;
const dhy = new Person()
console.log(dhy.info())
const imgBox = document.getElementById('imgBox')
imgBox.appendChild(img)
$("#imgBox").addClass('extract')

function mergeSort(array) {
  return mergeSortRec(array)
}

function mergeSortRec(array = []) {
  const len = array.length;
  if(len === 1) {
    return array;
  }
  const mid = Math.floor(len/2)
  const left = array.slice(0, mid);
  const right = array.slice(mid, len);


  return merge(mergeSortRec(left) ,mergeSortRec(right));
}

function merge(left= [],right= []) {
  let il=0, ir = 0;
  let result = [];

  //判断左右数组值的大小，直到某一个数组全部被存入result
  while(il < left.length && ir < right.length) {
    if(left[il] > right[ir]) {
      result.push(right[ir++])
    } else {
      result.push(left[il++])
    }
  } 

  //判断左数组是否全部存入
  while(il < left.length) {
    result.push(left[il++])
  }

  //判断右数组是否完全存入
  while(ir < right.length) {
    result.push(right[ir++])
  }

  return result;
}

console.log(mergeSort([5,4,2,1,3,6]))
