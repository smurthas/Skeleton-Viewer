var baseUrl = false;

$(document).ready(function() {
    if(baseUrl === false) window.alert("Couldn't find your locker, you might need to add a config.js (see dev.singly.com)");
});

Prolific = (function() {
  var container;
  var PAGE_SIZE = 100;

  function init() {
    container = $('#prolific');
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
    sort();
  }

  function addLink(person, datum) {
    $('ul', person).append(
      $('<li>').append(
        $('<a>', { 'href' : datum.link}).text(datum.title)
      )
    );
    var count = parseInt(person.attr('data-count'), 10) + 1;
    person.attr('data-count', count);
    $('.count', person).text(count);
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
        'data-id' : slug,
        'class' : 'person',
        'data-count' : 0
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

  function sort() {
    var data = $('.person', container).clone();
    data.sort(function(a,b) {
      return parseInt($(b).attr('data-count'), 10) -
             parseInt($(a).attr('data-count'), 10);
    });
    container.quicksand(data);
  }

  return {
    init : init
  }
})();

$(function() {
  Prolific.init();
});

