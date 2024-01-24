/* Global Vars */
var cmd_stack = [];
var cmd_stack_cnt = -1;

/* Focus on Terminal on startup | click */
// on StartUp
document.addEventListener("DOMContentLoaded", function() {
  $("#commandInput").attr("placeholder", "man");
  document.getElementById("commandInput").focus();
});
// on Click
$(".terminal").click(function(){
  document.getElementById("commandInput").focus();
})

/* Drag Terminal Arround */
$( ".terminal-window" )
  .draggable({
    cancel: ".terminal,input"
  });

/* Generate Color from string*/
// Credits 4 @spacewalkingninja
String.prototype.toHSL = function(opts) {
  // @ts-ignore
  var h, s, l;
  opts = opts || {};
  opts.hue = opts.hue || [0, 360];
  opts.sat = opts.sat || [75, 100];
  opts.lit = opts.lit || [40, 60];
  opts.tra = opts.tra || '0.5';

  // @ts-ignore
  var range = function(hash, min, max) {
      var diff = max - min;
      var x = ((hash % diff) + diff) % diff;
      return x + min;
  }

  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
      hash = this.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
  }

  h = range(hash, opts.hue[0], opts.hue[1]);
  s = range(hash, opts.sat[0], opts.sat[1]);
  l = range(hash, opts.lit[0], opts.lit[1]);

  s /= 100;
  l /= 100;
  // @ts-ignore
  const k = n => (n + h / 30) % 12;
  // @ts-ignore
  const a = s * Math.min(l, 1 - l);
  // @ts-ignore
  const f = n => // @ts-ignore
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return 'rgba('+ parseInt(255 * f(0)) +','+ parseInt(255 * f(8)) + ','+ parseInt(255 * f(4)) + ',  ' + opts.tra + ')';
}

/* Scroll Terminal to the bottom */
function terminalScroll(){
    $("section.terminal").scrollTop(
        $("section.terminal").height() + 10000
    );
}


/* Run Commands */
function runScripts(data, pos) {
    var prompt = $(".prompt"),
        script = data[pos];
    if (script.clear === true) {
        $(".history").html("");
    }
    switch (script.action) {
        case "type":
        // cleanup for next execution
        prompt.removeData();
        // $(".typed-cursor").text("");
        prompt.typed({
            strings: script.strings,
            typeSpeed: 5,
            callback: function () {
                var history = $(".history").html();
                history = history ? [history] : [];
                history.push("~$ " + data[pos].command + prompt.text());


                if (script.output) {
                    history.push(script.output);
                    prompt.html("");
                    $(".history").html(history.join("<br>"));
                }
                // scroll to the bottom of the screen
                terminalScroll();

                // Run next script
                // pos++;
                // if (pos < data.length) {
                //     setTimeout(function () {
                //         runScripts(data, pos);
                //     }, script.postDelay || 1000);
                // }
            },
        });
        break;
        case "print":
            var history = $(".history").html();
            history = history ? [history] : [];
            history.push("~$ " + data[pos].command + prompt.text());
            history.push("Opening Print Dialog...<br>");
            $(".history").html(history.join("<br>"));
            terminalScroll();
            setTimeout(() => {
                window.print();
            }, 100);
            break;
        case "view":
            break;
        case "input":
            createInput(script, pos);
        break;
    }
}

/* If you create Inputs you now what you doin.. */
function createInput(script, pos) {
    var prompt = $(".prompt");
    var inputElement = $('<input type="text" class="terminal-input">');
    var submitButton = $('<button type="button">Submit</button>');

    submitButton.on("click", function () {
        var inputValue = inputElement.val().trim();
        // Display entered input in the terminal
        var history = $(".history").html();
        history = history ? [history] : [];
        history.push("~$ " + inputValue);
        $(".history").html(history.join("<br>"));

        // Display output based on the entered input
        var output = script.output.replace('<span class="input-value"></span>', inputValue);
        history.push(output);
        $(".history").html(history.join("<br>"));

        clearInput();
        // Continue to the next script
        pos++;
        if (pos < data.length) {
        runScripts(data, pos);
        }
    });

    $(".history").append("~$ ");
    $(".history").append(prompt.text());
    $(".history").append(inputElement);
    $(".history").append(submitButton);
}

async function fetchSudoObj() {
    const phpScriptURL = "https://desota.net/assistant/desota_downloads/vargasOS_sudo.php";

    try {
        const response = await fetch(phpScriptURL);
        if (!response.ok) {
            // Handle non-OK response
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }

        const jsonData = await response.json();
        console.log("🚀 ~ file: script.js:170 ~ fetchSudoObj ~ jsonData:", jsonData)
        return jsonData;
    } 
    catch (error) {
        // Handle fetch error
        console.error('Error fetching data:', error);
        return null;
    }
}

async function getSudoId() {
    try {
        const sudo_obj = await fetchSudoObj();
        $(".wa_url").attr("href", "https://wa.me/" + sudo_obj.whatsapp);
        $(".mail_url").attr("href", "mailto:" + sudo_obj.gmail);
        const sudoID = $(".vargasOS-run-sudo_id").html();
        console.log("🚀 ~ file: script.js:186 ~ getSudoId ~ sudoID:", sudoID)
        return $(".vargasOS-run-sudo_id").html();
    } 
    catch (error) {
        // Handle error if fetchSudoObj fails
        console.error('Error getting sudo ID:', error);
        return $(".vargasOS-run-sudo_id").html();
    }
}

/* Main Function */
// $(async function() {
document.addEventListener("DOMContentLoaded", async function() {
    console.log("Hi there 👋");
    /* Commands List */
    var data = [
        /* List Content */
        {
            action: "type",
            strings: [""],
            output:
                '<span class="green">cv.py</span><br>&nbsp;',
            postDelay: 500,
            command: "ls",
        },
        { 
            action: "type",
            strings: [""],
            output:
                'Total 1<br>-rwxr-xr-x&nbsp;&nbsp;1&nbsp;&nbsp;root&nbsp;&nbsp;root&nbsp;&nbsp;5637&nbsp;&nbsp;Jan 2024 8&nbsp;&nbsp;04:25&nbsp;&nbsp;<span class="green">cv.py</span><br>&nbsp;',
            postDelay: 500,
            command: "ls -l",
        },
        /* Python Version */
        {
            action: 'type',
            strings: [""],
            output: 'Python 3.12.1<br>&nbsp;',
            postDelay: 500,
            command: "python3 --version",
        },
        {
            action: 'type',
            strings: [""],
            output: 'Python 3.12.1<br>&nbsp;',
            postDelay: 500,
            command: "python --version",
        },
        {
            action: 'type',
            strings: [""],
            output: 'Python 3.12.1<br>&nbsp;',
            postDelay: 500,
            command: "py --version",
        },
        {
            action: 'type',
            strings: [""],
            output: 'Python 3.12.1<br>&nbsp;',
            postDelay: 500,
            command: "python3",
        },
        {
            action: 'type',
            strings: [""],
            output: 'Python 3.12.1<br>&nbsp;',
            postDelay: 500,
            command: "python",
        },
        {
            action: 'type',
            strings: [""],
            output: 'Python 3.12.1<br>&nbsp;',
            postDelay: 500,
            command: "py",
        },
        /* Clear Terminal */
        {
            action: 'type',
            strings: [""],
            clear: true,
            command: "clear",
        },
        {
            action: 'type',
            strings: [""],
            clear: true,
            command: "cls",
        },
        /* Internal Terminal Data */
        // Terminal Egg
        {
            action: "type",
            strings: [""],
            command: "python3 cv.py --egg",
            output: 
                '<span class="gray">BoomShakalaka my fellow dev c:</span><br><br>Don\'t forget to give this <a href="https://github.com/franciscomvargas/vargasos.portfolio">project`s repository</a> a star! ⭐<br>&nbsp;',
        },
        {
            action: "type",
            strings: [""],
            command: "python3 ./cv.py --egg",
            output: 
                '<span class="gray">BoomShakalaka my fellow dev c:</span><br><br>Don\'t forget to give this <a href="https://github.com/franciscomvargas/vargasos.portfolio">project`s repository</a> a star! ⭐<br>&nbsp;',
        },
        /* External Terminal Data */
        // Manuals
        // • vargasOS
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-man_vargasos").html(),
            postDelay: 300,
            command: "man",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-man_vargasos").html(),
            postDelay: 300,
            command: "man vargasos",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-man_vargasos").html(),
            postDelay: 300,
            command: "help",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-man_vargasos").html(),
            postDelay: 300,
            command: "?",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-man_vargasos").html(),
            postDelay: 300,
            command: "show",
        },
        // Get cv.py Usage
        // • python3 cv.py
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-usage").html(),
            postDelay: 300,
            command: "python3 cv.py",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-usage").html(),
            postDelay: 300,
            command: "python3 ./cv.py",
        },
        // • python3 cv.py -h
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-usage").html(),
            postDelay: 300,
            command: "python3 cv.py -h",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-usage").html(),
            postDelay: 300,
            command: "python3 ./cv.py -h",
        },
        // • python3 cv.py --help
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-usage").html(),
            postDelay: 300,
            command: "python3 cv.py --help",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-usage").html(),
            postDelay: 300,
            command: "python3 ./cv.py --help",
        },
        // Run Script with `ID` Argument
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-id").html(),
            postDelay: 300,
            command: "python3 cv.py --id",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-id").html(),
            postDelay: 300,
            command: "python3 ./cv.py --id",
        },
        // • sudo `ID`
        {
            action: "type",
            strings: [""],
            output: await getSudoId(),
            postDelay: 300,
            command: "sudo python3 cv.py --id",
        },
        {
            action: "type",
            strings: [""],
            output: await getSudoId(),
            postDelay: 300,
            command: "sudo python3 ./cv.py --id",
        },
        // Run Script with `Academic` Argument
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --academic^250"],
            output: $(".vargasOS-run-academic").html(),
            postDelay: 300,
            command: "python3 cv.py --academic",
        },
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --academic^250"],
            output: $(".vargasOS-run-academic").html(),
            postDelay: 300,
            command: "python3 ./cv.py --academic",
        },
        // • Education
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --academic^250"],
            output: $(".vargasOS-run-academic .education").html(),
            postDelay: 300,
            command: "python3 cv.py --academic educ",
        },
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --academic^250"],
            output: $(".vargasOS-run-academic .education").html(),
            postDelay: 300,
            command: "python3 ./cv.py --academic educ",
        },
        // • Cerificates
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --academic^250"],
            output: $(".vargasOS-run-academic .certificates").html(),
            postDelay: 300,
            command: "python3 cv.py --academic cert",
        },
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --academic^250"],
            output: $(".vargasOS-run-academic .certificates").html(),
            postDelay: 300,
            command: "python3 ./cv.py --academic cert",
        },
        // Run Script with `Pro` Argument
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --pro^300"],
            output: $(".vargasOS-run-pro").html(),
            postDelay: 300,
            command: "python3 cv.py --pro",
        },
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --pro^300"],
            output: $(".vargasOS-run-pro").html(),
            postDelay: 300,
            command: "python3 ./cv.py --pro",
        },
        // • Desota Pro
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .desota_pro").html(),
            postDelay: 300,
            command: "python3 cv.py --pro desota",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .desota_pro").html(),
            postDelay: 300,
            command: "python3 ./cv.py --pro desota",
        },
        // • Upwork
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .upwork").html(),
            postDelay: 300,
            command: "python3 cv.py --pro upwork",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .upwork").html(),
            postDelay: 300,
            command: "python3 ./cv.py --pro upwork",
        },
        // • Agicore
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .agicore").html(),
            postDelay: 300,
            command: "python3 cv.py --pro agicore",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .agicore").html(),
            postDelay: 300,
            command: "python3 ./cv.py --pro agicore",
        },
        // • Jpm
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .jpm").html(),
            postDelay: 300,
            command: "python3 cv.py --pro jpm",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .jpm").html(),
            postDelay: 300,
            command: "python3 ./cv.py --pro jpm",
        },
        // • Ferpinta
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .ferpinta").html(),
            postDelay: 300,
            command: "python3 cv.py --pro ferpinta",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-pro .ferpinta").html(),
            postDelay: 300,
            command: "python3 ./cv.py --pro ferpinta",
        },
        // Run Script with `Skills` Argument
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --skills^300"],
            output: $(".vargasOS-run-skills").html(),
            postDelay: 300,
            command: "python3 cv.py --skills",
        },
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --skills^300"],
            output: $(".vargasOS-run-skills").html(),
            postDelay: 300,
            command: "python3 ./cv.py --skills",
        },
        // Run Script with `Portfolio` Argument
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio").html(),
            postDelay: 300,
            command: "python3 cv.py --portfolio",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio").html(),
            postDelay: 300,
            command: "python3 ./cv.py --portfolio",
        },
        // • Ignore Portfolio Desota
        {
            action: "type",
            strings: [""],
            output: 
                $(".vargasOS-run-portfolio .portfolioTag").html() +
                $(".vargasOS-run-portfolio .algoz").html() +
                $(".vargasOS-run-portfolio .esquotes").html()+
                $(".vargasOS-run-portfolio .rift").html(),
            postDelay: 300,
            command: "sudo python3 cv.py --portfolio -i desota",
        },
        {
            action: "type",
            strings: [""],
            output: 
                $(".vargasOS-run-portfolio .portfolioTag").html() +
                $(".vargasOS-run-portfolio .algoz").html() +
                $(".vargasOS-run-portfolio .esquotes").html()+
                $(".vargasOS-run-portfolio .rift").html(),
            postDelay: 300,
            command: "sudo python3 ./cv.py --portfolio -i desota",
        },
        // • Project: Algoz
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .algoz").html(),
            postDelay: 300,
            command: "python3 cv.py --portfolio algoz",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .algoz").html(),
            postDelay: 300,
            command: "python3 ./cv.py --portfolio algoz",
        },
        // • Project: EsQuotes
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .esquotes").html(),
            postDelay: 300,
            command: "python3 cv.py --portfolio esquotes",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .esquotes").html(),
            postDelay: 300,
            command: "python3 ./cv.py --portfolio esquotes",
        },
        // • Project: Desota
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .desota").html(),
            postDelay: 300,
            command: "python3 cv.py --portfolio desota",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .desota").html(),
            postDelay: 300,
            command: "python3 ./cv.py --portfolio desota",
        },
        // • Project: Rift
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .rift").html(),
            postDelay: 300,
            command: "python3 cv.py --portfolio rift",
        },
        {
            action: "type",
            strings: [""],
            output: $(".vargasOS-run-portfolio .rift").html(),
            postDelay: 300,
            command: "python3 ./cv.py --portfolio rift",
        },
        // Run Script with `Contacts` Argument
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --contact^250"],
            output: $(".vargasOS-run-contact").html(),
            command: "python3 cv.py --contact",
        },
        {
            action: "type",
            strings: [""],
            // strings: ["python3 cv.py --contact^250"],
            output: $(".vargasOS-run-contact").html(),
            command: "python3 ./cv.py --contact",
        },
        // Run Script with `IGiveUp` Argument
        // • IGiveUp
        {
            action: "type",
            strings: [""],
            output: 
                $(".vargasOS-run-id").html() +
                $(".vargasOS-run-skills").html() +
                $(".vargasOS-run-pro").html() +
                $(".vargasOS-run-academic").html() +
                $(".vargasOS-run-portfolio").html() +
                $(".vargasOS-run-contact").html(),
            postDelay: 300,
            command: "igiveup",
        },
        // • IGiveUp ~ vargasos
        {
            action: "type",
            strings: [""],
            output: 
                $(".vargasOS-run-id").html() +
                $(".vargasOS-run-skills").html() +
                $(".vargasOS-run-pro").html() +
                $(".vargasOS-run-academic").html() +
                $(".vargasOS-run-portfolio").html() +
                $(".vargasOS-run-contact").html(),
            postDelay: 300,
            command: "vargasos",
        },
        /* Print Command */
        {
            action: "print",
            command: "print",
        },
        {
            action: "print",
            command: "lp",
        },

    ];

    console.log("Commands Ready!");

    /* Listen for key press */
    $("#commandInput").on("keydown", function (event) {
        switch(event.key){
            case "ArrowUp":
                // Stack POS Logic
                if(cmd_stack_cnt === 0){
                    break;
                }
                if(cmd_stack_cnt < 0){
                    cmd_stack_cnt = cmd_stack.length -1;
                }
                else{
                    cmd_stack_cnt--;
                }
                // Change Input
                setStack(event);
                break;
            case "ArrowDown":
                // Stack POS Logic
                if(cmd_stack_cnt >= 0 && cmd_stack_cnt < cmd_stack.length -1){
                    cmd_stack_cnt++;
                }
                else if(cmd_stack_cnt === cmd_stack.length -1){
                    cmd_stack_cnt = -2;
                }
                // Change Input
                setStack(event);
                break;
            case "Enter":
                event.preventDefault(); // Prevent form submission
                cmd_stack_cnt = -1;
                var enteredCommand = $(this).val().trim().toLowerCase();
                var bgcolor = enteredCommand.toHSL({hue: [90, 360],sat: [75, 95],lit: [55, 65], tra: '0.65'});
                $("body").css("background", bgcolor);

                // Handle multiple python prefixes
                if (enteredCommand.startsWith("python ")) {
                    enteredCommand = enteredCommand.replace("python ", "python3 ");
                }
                if (enteredCommand.startsWith("py ")) {
                    enteredCommand = enteredCommand.replace("py ", "python3 ");
                }

                // Get Args:
                var args = []
                // Save cmd in stack
                saveStack();
                clearInput();
                // Find the script that matches the entered command
                var matchingScript = data.find(function (script) {
                    return script.command === enteredCommand;
                });
                var usageScript = data.find(function (script) {
                    return script.command === "python3 cv.py";
                });
                if (matchingScript) {
                    // Run the matching script
                    runScripts([matchingScript], 0);
                } else {
                    // Handle unknown command
                    var history = $(".history").html();
                    history = history ? [history] : [];

                    if(enteredCommand === "")
                    {
                        history.push("~$ " + enteredCommand + "&nbsp;");
                    }
                    else if(enteredCommand.startsWith("python3 ") && !enteredCommand.startsWith("python3 cv.py")){
                        const filename = enteredCommand.split(' ')[1];
                        history.push("~$ " + enteredCommand + "<br>python3: can't open file '~/" + filename + "': [Errno 2] No such file or directory<br>&nbsp;");
                    }
                    else if(enteredCommand.startsWith("python3 cv.py ")){
                        runScripts([usageScript], 0);
                    }
                    else
                    {
                        history.push("~$ " + enteredCommand + "<br>" + enteredCommand + ": command not found<br>&nbsp;");
                    }
                    $(".history").html(history.join("<br>"));
                    clearInput();
                    terminalScroll();
                }
                if (cmd_stack.length > 0)
                    $("#commandInput").attr("placeholder", "");
                break;
        }
    });

    /* Clear Terminal */
    function clearInput() {
        $("#commandInput").val("");
    }
    /* Set Terminal Input based on Stack Counter `cmd_stack_cnt` */
    function setStack(event) {
        event.preventDefault(); // Prevent form submission
        var curr_stack = $("#commandInput").val().trim();
        if(cmd_stack_cnt !== -1){
            // Save cmd in stack
            saveStack(false);
            if (curr_stack === cmd_stack[cmd_stack.lenght]){
                cmd_stack_cnt = cmd_stack[cmd_stack.lenght] -1;
            }
            $("#commandInput").val(cmd_stack[cmd_stack_cnt]);
        }
        else {
            clearInput();
        }
        
    }
    /* Save current Terminal Input in Stack */
    function saveStack(fromEnter=true){
        var curr_stack = $("#commandInput").val().trim();
        if (curr_stack){
            if(cmd_stack.includes(curr_stack) && fromEnter){
                const _id = cmd_stack.indexOf(curr_stack);
                cmd_stack.splice(_id, _id+1)
            }
            if(!cmd_stack.includes(curr_stack)){
                cmd_stack.push(curr_stack);
                console.log("🚀 ~ file: script.js:277 ~ saveStack ~ cmd_stack:", cmd_stack)
            }
        }
    }
});