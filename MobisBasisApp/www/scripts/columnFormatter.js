const LABEL_EDITZONE = "LABEL_EDITZONE";
const INPUT_ABC = "INPUT_ABC";
const INPUT_123 = "INPUT_123";
const VARIABLE_ABC = "VARIABLE_ABC";
const VARIABLE_123 = "VARIABLE_123";

function formatLowerColumn(columnContainer) {
    var column = Array.from($(columnContainer).children())
    //Checks if column contains more than one entry and if first entry is LABEL_EDITZONE
    if (column.length > 1 && $(column[0]).hasClass(LABEL_EDITZONE)) {

        //Finding all elements with class LABEL_EDITZONE
        var LEIndexes = [];
        column.forEach(function (ele, index) {
            if ($(ele).hasClass(LABEL_EDITZONE)) {
                LEIndexes.push(index);
            }
        })

        //Colleting all sections corresponding to an element with class LABEL_EDITZONE
        //First element has class LABEL_EDITZONE
        //Other elements have classes starting with INPUT or VARIABLE
        var LESections = [];
        for (var i = 0; i < LEIndexes.length; i++) {

            //get index of current label_editzone element and index of next label_editzone element or length
            var LEindex = LEIndexes[i];
            var nextLEindex = (i === LEIndexes.length - 1 ? column.length : LEIndexes[i + 1]);

            LESections.push(column.slice(LEindex, nextLEindex));
        }

        //TODO: if Section contains only one element & make this more beautiful (maybe with reduce to return the length to each other section)
        var startColumn = 1;
        LESections.forEach(function (LESection) {

            $(LESection[0]).gridPosition(1, startColumn, (startColumn + LESection.length - 1));

            for (var i = 1; i < LESection.length; i++) {
                $(LESection[i]).gridPosition(2, startColumn, startColumn + 1);
                startColumn++;
            }

            if (LESection.length === 1) {
                startColumn++;
            }
        })

        //generate Layout String
        var templateColumnsString = LESections.map(function (section) {
            return generateSectionColumnsTemplate(section)
        }).join(' ');

        $(columnContainer).css('gridTemplateColumns', templateColumnsString);

    }
}

function generateSectionColumnsTemplate(section) {
    if (section.length === 1) {
        return 'auto'
    } else {
        return section.slice(1).map(function (ele) {
            if ($(ele).hasClass(VARIABLE_ABC) || $(ele).hasClass(VARIABLE_123)) {
                return 'max-content';
            } else if ($(ele).hasClass(INPUT_ABC) || $(ele).hasClass(INPUT_123)) {
                return 'auto';
            } else {
                return 'auto';
            }
        }).join(' ');
    }
}

//helper
$.fn.gridPosition = function (row, columnStart, columnEnd = -1) {
    this.css("grid-row-start", `${row}`);
    this.css("grid-row-end", `${row + 1}`);
    this.css("grid-column-start", `${columnStart}`);
    if (columnEnd < 0) {
        this.css("grid-column-end", `${columnStart + 1}`);
    } else {
        this.css("grid-column-end", `${columnEnd}`);
    }
};

