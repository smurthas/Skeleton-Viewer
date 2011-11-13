var baseUrl = false;

$(document).ready(function() {
    if(baseUrl === false) window.alert("Couldn't find your locker, you might need to add a config.js (see dev.singly.com)");
});

Prolific = (function() {
  var container;
  var PAGE_SIZE = 100;

  function init() {
    container =  $('#prolific');
    loadLinks(1);
  }

  function loadLinks() {
    $.getJSON(baseUrl + '/Me/links/',
      {'limit' : PAGE_SIZE, 'full' : true},
      buildLinks
    );
  }

  function buildLinks(data) {
    if(!data || data.length === 0) { return; }
    for(var i in data) {
      var datum = data[i];
      var people = findOrCreatePeople(datum);
      $.each(people, function(i, person) {addLink(person, datum)})
    }
  }

  function addLink(person, datum) {
    $('ul', person).append(
      $('<li>').append(
        $('<a>', { 'href' : datum.link}).text(datum.title)
      )
    );
    var count = $('.count', person);
    count.text(parseInt(count.text(), 10) + 1);
  }

  function findOrCreatePeople(datum) {
    return $.map(datum.encounters, findOrCreatePerson);
  }

  function findOrCreatePerson(encounter) {
    var slug = slugify(encounter.from);
    var person = $('#' + slug);
    if (person.length === 0) {
      person = $('<div>', {
        'id' : slug,
        'class' : 'person'
      }).append(
        $('<h3>').append(
          $('<span>', { 'class' : 'count' }).text(0),
          encounter.from
        ),
        $('<ul>')
      );
      container.append(person);
    }
    return person;
  }

  function slugify(name) {
    return 'person-' + name.toLowerCase().replace(/\W+/g, '_');
  }

  return {
    init : init
  }
})();

$(function() {
  Prolific.init();
});

