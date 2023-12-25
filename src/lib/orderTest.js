var numArr = [
  { id: 0, order: 1, name: "n1" },
  { id: 1, order: 2, name: "n2" },
  { id: 2, order: 3, name: "n3" },
  { id: 3, order: 4, name: "n4" },
  { id: 4, order: 5, name: "n5" },
  { id: 5, order: 6, name: "n6" },
  { id: 6, order: 7, name: "n7" },
  { id: 7, order: 8, name: "n8" },
  { id: 8, order: 9, name: "n9" },
];
var targetInp = { id: 5, order: 5, name: "target5" };

function sortOrder(arr, targetInp, target) {
  let tempArr = [];
  let cleanArr = [];
  arr.map((item, index) => {
    if (item.order === target) {
      tempArr.push({ ...targetInp, order: target });
      tempArr.push({ ...item, order: target + 1 });
    } else if (item.order > target) {
      tempArr.push({ ...item, order: item.order + 1 });
    } else {
      tempArr.push(item);
    }
  });

  tempArr.map((input, index) => {
    if (input.id === targetInp.id) {
      if (input.order === target) {
        cleanArr.push(input);
      }
    } else {
      cleanArr.push(input);
    }
  });
  return cleanArr;
}
