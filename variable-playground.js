var array = [37.5, 28];

function updateArray() {
	newArray = array;
	newArray.push(29);
	return newArray;
}

console.log('array now contains ' + updateArray());