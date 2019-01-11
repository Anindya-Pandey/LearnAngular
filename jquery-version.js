//window.alert('Helloooo');
class Row {
	constructor(columnValues) {
		this.columnValues = columnValues;
		this.display = function(){
			console.log(columnValues);
		}
	}
}

class Table {
	constructor() {
		$(".hidden-column").hide();

		this.editRowNumber = -1;
		
		this.sortByColumn = -1;

		this.rows = [];
		
		this.createTableRowHtmlString = function(row, rowNumber){
			var columnValues = row.columnValues.map(function(columnValue){
				return columnValue.toString();
			});
			
			var rowHtmlString = "<tr class='row-" + rowNumber.toString() + "'>";

			for (var columnValueIndex in columnValues) {
				var tdOpeningTagString;
				if (columnValueIndex == 4) {
					tdOpeningTagString = "<td class='hidden-column'>";
				}
				else {
					tdOpeningTagString = "<td>";
				}

				rowHtmlString = rowHtmlString + tdOpeningTagString + columnValues[columnValueIndex] + "</td>";
			}

			rowHtmlString = rowHtmlString + "<td><button class='edit-row-button' id='" + rowNumber.toString() + "'>Edit</button></td>";	
			rowHtmlString = rowHtmlString + "</tr>";

			rowHtmlString = rowHtmlString + "<tr class='edit-row-input edit-row-input-" + rowNumber.toString() + "'>" +
				"<td colspan=5><input type='text'><button class='done-button' id='" + rowNumber.toString() + "'>Done</button></td></tr>";

			//console.log(rowHtmlString);
			return rowHtmlString;			
		}

		this.createTBodyHtmlString = function(){
			var tableTemp = this;
			var createTableRowHtmlString = this.createTableRowHtmlString;
			$("#table tbody").empty();
			var rowNumber = 0;
			this.rows.map(function(row){
				$("#table tbody").append(createTableRowHtmlString(row, rowNumber));
				rowNumber = rowNumber + 1;
			});
			$(".hidden-column").hide();
			$(".edit-row-input").hide();
			//$(".edit-done").hide();
			$(".edit-row-button").click(function(e){
				//console.log(e.currentTarget.id);				
				if (tableTemp.editRowNumber == -1) {
					tableTemp.editRowNumber = e.currentTarget.id;
					$(".row-" + e.currentTarget.id.toString()).hide();
					$(".edit-row-input-" + e.currentTarget.id.toString()).show();
				}
				else {
					//console.log('wow');
					$(".row-" + tableTemp.editRowNumber.toString()).show();
					$(".edit-row-input-" + tableTemp.editRowNumber.toString()).hide();
					tableTemp.editRowNumber = e.currentTarget.id;
					$(".row-" + e.currentTarget.id.toString()).hide();
					$(".edit-row-input-" + e.currentTarget.id.toString()).show();				
				}
				//console.log(tableTemp.editRowNumber);
			});

			$(".done-button").click(function(e){
				tableTemp.editRowNumber = -1;
				//console.log(tableTemp.rows.length);
				var newColumnValues = $(".edit-row-input-" + e.currentTarget.id.toString() + " input").val().split(",").map(function(newColumnValueString){
					return parseInt(newColumnValueString);
				});

				if(newColumnValues.length == 5){
					tableTemp.rows[e.currentTarget.id].columnValues = newColumnValues;
					if (tableTemp.sortByColumn != -1) {
						tableTemp.sortTable(tableTemp.sortByColumn);
					}
					else {
						tableTemp.createTBodyHtmlString();						
					}
				}

				$(".row-" + e.currentTarget.id.toString()).show();
				$(".hidden-column").hide();
				$(".edit-row-input-" + e.currentTarget.id.toString()).hide(); 
			});
		}

		this.addRow = function(row) {
			this.rows.push(row);
			this.createTBodyHtmlString();
		}

		this.sortTable = function(columnNumber) {
			/*this.rows.map(function(row){
				row.display();
			});*/
			this.sortByColumn = columnNumber;
			this.rows.sort(function(row1, row2) {
				if(row1.columnValues[columnNumber - 1] < row2.columnValues[columnNumber - 1]){
					return -1;
				}
				else if(row1.columnValues[columnNumber - 1] > row2.columnValues[columnNumber - 1]){
					return 1;
				}
				return 0;
			});
			/*this.rows.map(function(row){
				row.display();
			});*/
			this.createTBodyHtmlString();
		}

	}
}

/*
function createTableRowHtmlString(rowString) {
	columnValues = rowString.split(",");

	//console.log(columnValues);
	if (columnValues.length < 5) {
		return "";
	}
	rowHtmlString = "<tr>";

	for (columnValueIndex in columnValues) {
		if (columnValueIndex == 4) {
			tdOpeningTagString = "<td class='hidden-column'>";
		}
		else {
			tdOpeningTagString = "<td>";
		}

		rowHtmlString = rowHtmlString + tdOpeningTagString + columnValues[columnValueIndex] + "</td>";
	}

	rowHtmlString = rowHtmlString + "</tr>";

	//console.log(rowHtmlString);
	return rowHtmlString;
}

function addRow(rowString) {
	$("#table tbody").append(createTableRowHtmlString(rowString));
}
*/
function addRowButtonClickEventHandler(table) {
	var rowString = $("#add-row-input").val();
	var columnValues = rowString.split(",").map(function(columnValueString) {
		return parseInt(columnValueString);
	});
	if(columnValues.length < 5 || columnValues.length > 5){
		return;
	}
	var newRow = new Row(columnValues);
	table.addRow(newRow);
}

function sortButtonClickEventHandler(table) {
	var columnNumberToSort = parseInt($("#column-number-input").val());
	if(columnNumberToSort < 1 || columnNumberToSort > 5){
		return;
	}
	table.sortTable(columnNumberToSort);
}

$(document).ready(function() {
	var table = new Table();
	/*
	var row1 = new Row([1,2,3,4,5]);
	var row2 = new Row([1,2,3,3,5]);
	var rows = [row1, row2];
	console.log(rows);
	rows.sort(function(row1, row2) {
		console.log(row1.columnValues[3]);
		console.log(row2.columnValues[3]);
		return -1;
	});
	console.log(rows);
	*/
	$("#add-row-button").click(function() {
		addRowButtonClickEventHandler(table);
	});

	$("#sort-button").click(function() {
		sortButtonClickEventHandler(table);
	});
});