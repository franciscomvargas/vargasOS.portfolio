$(function() {
  var data = [
    {
      action: 'type',
      strings: ["Hi there!", "Let me see what's this OS about...^500", "     ls -l"],
      output: '<span class="gray"># list directory content</span><br>Total 1<br>-rwxr-xr-x&nbsp;&nbsp;1&nbsp;&nbsp;root&nbsp;&nbsp;root&nbsp;&nbsp;5637&nbsp;&nbsp;Dec 2023 19&nbsp;&nbsp;04:25&nbsp;&nbsp;portfolio.py<br>&nbsp;',
      postDelay: 500
    },/*
    {
      action: 'type',
      strings: ["python3 ./portfolio.py^500"],
      output: '<span class="gray"># Run python script</span><br>bash: python3: command not found<br>&nbsp;',
      postDelay: 1000
    },
    {
      action: 'type',
      strings: ["conda create --prefix ./venv python=3.12 -y^1000"],
      output: '<span class="gray"># Create Virtual Environment</span><br>Collecting package metadata (repodata.json): done<br>Solving environment: done<br><br>## Package Plan ##<br><br>&nbsp;&nbsp;environment location: /home/vargas/venv<br>&nbsp;',
      postDelay: 400
    },
    {
      action: 'type',
      strings: ["./venv/bin/python3 --version"],
      output: '<span class="gray"># Confirm virtual environment&#39;s python path</span><br>Python 3.12.1<br>&nbsp;',
      postDelay: 1000
    },
    {
      action: 'type',
      strings: ["clear"],
      output: '&nbsp;',
      postDelay: 200
    },*/
    {// Get script Usage
      //usage: portfolio.py [-h] [--id] [--skills] [--projects] [--contact]

      //Get to know my work, by how I expirience it! 

      //options:
      //-h, --help  Show this help message and exit
      //--id        About me
      //--skills    Technical Habilities
      //--projects  My babies
      //--contact   How to reach me
      action: 'type',
      //clear: true,
      strings: ['python3 portfolio.py^100'],
      output: '<span class="gray">usage: portfolio.py [-h] [--id] [--skills] [--projects] [--contact]<br><br>Get to know my work, by how I expirience it!<br><br>options:<br>-h, --help&nbsp;&nbsp;Show this help message and exit<br>--id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;About me<br>--skills&nbsp;&nbsp;&nbsp;&nbsp;Technical Habilities<br>--projects&nbsp;&nbsp;My babies<br>--contact&nbsp;&nbsp;&nbsp;How to reach me</span><br>&nbsp;',
      postDelay: 2500
    },
    {// Run Script with Profile Argument
      action: 'type',
      strings: ['python3 portfolio.py --id^250'],
      output: $('.vargasOS-run-id').html(),
      postDelay: 2500
    },
    {// Run Script with Skills Argument
      action: 'type',
      strings: ['python3 portfolio.py --skills^300'],
      output: $('.vargasOS-run-skills').html(),
      postDelay: 2500
    },
    {// Run Script with Projects Argument
      action: 'type',
      strings: ['python3 portfolio.py --projects^500'],
      output: $('.vargasOS-run-projects').html(),
      postDelay: 2500
    },
    {// Run Script with Contacts Argument
      action: 'type',
      strings: ['python3 portfolio.py --contact^250'],
      output: $('.vargasOS-run-contact').html(),
    },
    {
      action: 'type',
      strings: ["That's all!^500", '']
    }
  ];
  console.log("Hi there 👋")
  runScripts(data, 0);
});

function runScripts(data, pos) {
  var prompt = $('.prompt'),
      script = data[pos];
  if(script.clear === true) {
    $('.history').html(''); 
  }
  switch(script.action) {
    case 'type':
      // cleanup for next execution
      prompt.removeData();
      $('.typed-cursor').text('');
      prompt.typed({
        strings: script.strings,
        typeSpeed: 5,
        callback: function() {
          var history = $('.history').html();
          history = history ? [history] : [];
          history.push('~$&nbsp;' + prompt.text());
          if(script.output) {
            history.push(script.output);
            prompt.html('');
            $('.history').html(history.join('<br>'));
          }
          // scroll to bottom of screen
          $('section.terminal').scrollTop($('section.terminal').height() + 10000);
          // Run next script
          pos++;
          if(pos < data.length) {
            setTimeout(function() {
              runScripts(data, pos);
            }, script.postDelay || 1000);
          }
        }
      });
      break;
    case 'view':
      break;
  }
  if(pos === data.length - 1){
    console.log("See ya 👋")
  }
}