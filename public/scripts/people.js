var getPersonbyId = async (id) => {
  var response = await (await fetch('/db/id/' + id)).json();
  console.log(response);
  return response;
};

var getPeoplebyFilter = async (data_arr) => {
  var response = await (await fetch(
    '/db/filter/' + data_arr[0] + '/' + data_arr[1] + '/' + data_arr[2]
    + '/' + data_arr[3])).json();
  console.log(response);
  return response;
};

var getCurrSorted = async (sort_arr) => {
  var response = await (await fetch('/db/sort/' + sort_arr[0] + '/' + sort_arr[1])).json();
  console.log(response);
  return response;
}

var postPerson = async (data) => {
  var response = await fetch('/db', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response;
};
var putPerson = async (id, data) => {
  var response = await fetch('/db/id/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response;
};
var deletePerson = async (id) => {
  var response = await fetch('/db/id/' + id, {
    method: 'DELETE',
  });
  return response;
};

function generateColor(type) {
  var color = Array.from(type.split("")).map((char) => Math.floor(char.charCodeAt(0) * (255 / 122)));
  console.log("rbg(" + color.toString() + ")");
  return "rgb(" + color.toString() + ")";
}

function displayData(data) {
  $("[name=bstable-actions]").remove();
  var tb = $("#tb");
  var disp = $("#display").empty();
  console.log(data);
  var tbody = $("#tb > tbody").empty();
  data.forEach((item, index) => {
    var tr = $('<tr>');
    console.log(index, item);
    tr.append($('<td>').addClass("count").text(index + 1));
    for (var key in item) {
      tr.append($('<td>').addClass(key).text(item[key]));
    }
    tbody.append(tr);
    disp.append($('<div>')
      .addClass("blob")
      .attr('id', item['id'])
      .css({
        'background-color': generateColor(item['type']),
        'height': item['height'].toString() + "em",
        'width': (item['size'] / item['height']).toString() + "em"
      })
      .click(function () {
        var id = $(this).attr('id');
        console.log(id);
        handle_pop_up(id);
      })
      // .css('background-color', )
      .text(item['id'] + " - " + item['name'])
    );

  });
  bsTable();
}
function bsTable() {
  var tb = new BSTable("tb", {
    editableColumns: "2,3,4,5",
    onEdit: function (row) {
      var data = row.children().toArray().map(child => $(child).text()).slice(2, 6);
      var id = $(row.children().toArray()[1]).text();
      console.log(data);
      putPerson(id, data).then(() => { refresh() });
    },
    onBeforeDelete: function (row) {
      var id = $(row.children().toArray()[1]).text();
      deletePerson(id).then(() => { refresh() });
    },
    advanced: {
      columnLabel: 'Actions'
    }
  });
  tb.init();
}
async function handle_pop_up(id) {
  var person = await getPersonbyId(id);
  window.alert(JSON.stringify(person));
}
function handle_new_button() {
  var data = $(".new-input").toArray().map(i => i.value);
  console.log(data);
  postPerson(data).then(() => { refresh() });
}
function handle_filter_button() {
  var data = $(".filter-input").toArray().map(i => { return i.value == "" ? undefined : i.value });
  console.log(data);
  display(data, curr_sort_args);
}
function handle_filter_reset_button() {
  display([], curr_sort_args);
}
function handle_sort_button() {
  var sort_data = [];
  sort_data.push($('#sort-col-select :selected').val());
  sort_data.push($('#sort-order-select :selected').val());
  console.log(sort_data);
  display(curr_filter_args, sort_data);
}
var curr_filter_args = [];
var curr_sort_args = ['id', 'ASC'];
var display = async (filter_args, sort_args) => {
  curr_filter_args = filter_args;
  curr_sort_args = sort_args;
  var data = await getPeoplebyFilter(filter_args);
  data = await getCurrSorted(curr_sort_args);
  displayData(data);
}
var refresh = async () => { display(curr_filter_args, curr_sort_args); }
display(curr_filter_args, curr_sort_args);


