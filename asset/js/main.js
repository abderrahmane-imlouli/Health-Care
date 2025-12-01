// main.js - shared JS (requires jQuery & Bootstrap 5)
$(document).ready(function() {
  // NAV hover subtle animation
  $('.nav-link').hover(function(){
    $(this).css({'transform':'translateY(-3px)'});
  }, function(){
    $(this).css({'transform':'translateY(0)'});
  });

  // Buttons hover
  $('.btn-primary-custom').hover(function(){
    $(this).css({'filter':'brightness(1.03)'});
  }, function(){
    $(this).css({'filter':'brightness(1)'});
  });

  // Services page - clicking service menu items
  $('.service-menu').on('click', '.service-item', function(){
    var $this = $(this);
    $('.service-item').removeClass('active');
    $this.addClass('active');

    // update panel with dynamic data including services offered
    var title = $this.data('title') || $this.text().trim();
    var desc  = $this.data('desc') || '';
    var img   = $this.data('img') || '';
    var icon  = $this.data('icon') || '';
    var servicesData = $this.data('services') || '';

    var panel = $('.service-details-panel');

    // title + icon + description
    panel.find('.service-info h3').text("Department of " + title);
    panel.find('.service-info p').text(desc);

    // image
    if(img) panel.find('.service-image img').attr('src', img);

    // icon
    if(icon) panel.find('.service-icon-large i').attr('class', icon);

    // services offered list
    if(servicesData){
    let servicesList = servicesData.split('|')
        .map(s => `<li>${s}</li>`)
        .join('');
    panel.find('.service-info ul').html(servicesList);
    }

  });

  // Appointment page: dynamic form behavior
  function updateDoctorOptions(department){
    var doctorsByDept = {
      "General Consultation": ["Any Available Doctor","Dr. antonio damasio","Dr. elisabeth wenger"],
      "Cardiology": ["Any Cardiologist","Dr. James Wilson","Dr. helen fisher"],
      "Pediatrics": ["Any Pediatrician","Dr. Emily Chen","Dr. eric topol"],
      "Dermatology": ["Dr. michael ross"],
      "Pulmonology": ["Any Pulmonology","Dr. Lisa wong","Dr. jennifer doudna"],
      "Gastroenterology": ["Dr. binjamin spock"],
    };
    var list = doctorsByDept[department] || ["Any Available Doctor"];
    var $sel = $('#preferredDoctor');
    $sel.empty();
    $.each(list, function(i, name){
      $sel.append($('<option>').val(name).text(name));
    });
  }

$('#preferredDate').on('change', function(){

  const selected = $(this).val();
  if(!selected) return;

  const date = new Date(selected);
  const day = date.getDay(); 
  // saturday=6 | friday=5 | sunday=0
  const timeSlot = $('#timeSlot');

  timeSlot.empty();
  timeSlot.append('<option value="">Select time</option>');

  // closed on friday
  if(day === 5){
    timeSlot.append('<option disabled>No availability on Friday</option>');
    return;
  }

  let start = 8;
  let end   = 18;

//saturday 
  if(day === 6){
    start = 9;
    end   = 15;
  }

  for(let h=start; h < end; h++){
    let from = formatTime(h);
    let to   = formatTime(h+1);
    timeSlot.append(`<option>${from} - ${to}</option>`);
  }

});


function formatTime(hour){
  const ampm = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if(h === 0) h = 12;
  return `${String(h).padStart(2,'0')}:00 ${ampm}`;
}

  // date of birth -> calculate age live
  $(document).on('change', '#dob', function(){
    var dob = $(this).val();
    if(!dob) { $('#ageDisplay').text(''); return; }
    var age = calculateAge(dob);
    $('#ageDisplay').text(age + ' years');
  });

  function calculateAge(dobStr){
    var dob = new Date(dobStr);
    var diff = Date.now() - dob.getTime();
    var ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  // Appointment form validation & submit
  $('#appointmentForm').on('submit', function(e){
    e.preventDefault();
    var valid = true;
    $('.field-error').remove();

    function showError($el, msg){
      valid = false;
      var $err = $('<div class="field-error text-danger small mt-1">').text(msg);
      $el.after($err);
    }

    var firstName = $('#firstName').val().trim();
    var lastName  = $('#lastName').val().trim();
    var phone     = $('#phone').val().replace(/\s+/g,'');
    var email     = $('#email').val().trim();
    var dept      = $('#departmentSelect').val();

    if(!firstName) showError($('#firstName'), 'First name is required');
    if(!lastName) showError($('#lastName'), 'Last name is required');
    if(!phone || phone.length < 6) showError($('#phone'), 'Enter a valid phone number');
    if(!validateEmail(email)) showError($('#email'), 'Enter a valid email');
    if(!dept) showError($('#departmentSelect'), 'Select a department');

    // if special consultation show time slot validation
      var ts = $('#timeSlot').val();
      if(!ts) showError($('#timeSlot'), 'Select a time slot');
    

    if(!valid){
      $('html,body').animate({scrollTop: $('.apt-form').offset().top - 80}, 300);
      return;
    }

    // if valid -> show inline success
    var $btn = $('#appointmentSubmit');
    $btn.prop('disabled', true).text('Submitting...');
    setTimeout(function(){
      $btn.prop('disabled', false).text('Submit Appointment Request');
      var success = $('<div class="alert alert-success mt-3">').text('Appointment request submitted. We will contact you within 24 hours.');
      $('#appointmentForm').prepend(success);
      $('html,body').animate({scrollTop: $('.apt-form').offset().top - 80}, 300);
      $('#appointmentForm')[0].reset();
      $('#ageDisplay').text('');
      updateDoctorOptions('General Consultation');
    }, 900); // simulate server
  });

  function validateEmail(email){
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Services page: initialize first active data (in case attributes exist)
  if($('.service-menu .service-item.active').length){
    $('.service-menu .service-item.active').trigger('click');
  }

  // small smooth scroll for nav anchors
  $('a[href^="#"]').on('click', function(e){
    var target = $(this).attr('href');
    if(target.length > 1 && $(target).length){
      e.preventDefault();
      $('html,body').animate({scrollTop: $(target).offset().top - 72}, 400);
    }
  });
});
