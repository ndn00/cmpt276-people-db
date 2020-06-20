

var getPeople = async () => {
  var response = await (await fetch('/people')).json();
  return response;
};
var getPersonbyId = async (id) => {
  var response = await (await fetch('/people/' + id)).json();
  console.log(response);
  return response;
};
var postPerson = async (data) => {
  var response = await fetch('/people', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response;
};
var putPerson = async (id, data) => {
  var response = await fetch('/people/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response;
};
var deletePerson = async (id) => {
  var response = await fetch('/people/' + id, {
    method: 'DELETE',
  });
  return response;
};

function generateColor(type) {
  var color = Array.from(type.split("")).map((char) => Math.floor(char.charCodeAt(0) * (255 / 122)));
  console.log("rbg(" + color.toString() + ")");
  return "rgb(" + color.toString() + ")";
}

async function makeTable() {
  var tb = $("#tb");
  var disp = $("#display");
  var data = await getPeople();
  console.log(data);
  var tbody = $("#tb > tbody");
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
  return;
}
async function bsTable() {
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

var draw = () => { makeTable().then(() => { bsTable(); }) };
var refresh = () => {
  $('#tb > tbody').empty();
  $('#tb > thead > tr :last-child').remove();
  $('#display').empty();
  draw();
}
draw();