$(function() {
  var gotAssertion, logoutCallback, loginURL, logoutURL;

  gotAssertion = function(assertion) {
    if (assertion) {
      var csrftoken = $('meta[name=csrf-token]').attr('content');

      $.ajaxSetup({
        beforeSend: function(xhr, settings) {
          if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken)
          }
        }
      });

      return $.ajax({
        type: 'POST',
        url: '{{ login_url }}',
        data: {
          assertion: assertion
        },
        success: function(res, status, xhr) {
          return location.reload(true);
        },
        error: function(res, status, xhr) {
          return alert("login failure: " + status);
        }
      });
    }
  };
  logoutCallback = function(event) {
    var csrftoken = $('meta[name=csrf-token]').attr('content');

    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken)
        }
      }
    });
    $.ajax({
      type: 'POST',
      url: '{{ logout_url }}',
      success: function() {
        return location.reload(true);
      },
      error: function(res, status, xhr) {
        console.log(res);
        return alert("logout failure: " + status);
      }
    });
    return false;
  };
  return $(function() {
    $('#browserid-login').click(function() {
      navigator.id.get(gotAssertion);
      return false;
    });
    $('#browserid-logout').click(function() {
      navigator.id.logout(logoutCallback);
      return false;
    });
  });
});
