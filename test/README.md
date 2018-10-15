# CLSP Plugin Tests

## Soak Test

### Running the test

Notes:
* you will need to clone or download this repository locally
* you can safely disregard the `ERROR: The process "chrome.exe" not found.` messages that may occur when running this script
* if you forget to use an administrator cmd, the script will prompt you for one

Steps:
1. Open the windows start menu, type `cmd`
1. Right-click on the `cmd` application, and choose `Run as Administrator`
1. Accept the UAC prompt
1. `cd` into the directory that contains these files, e.g. `cd C:\Users\skyline\Desktop\clsp-videojs-plugin\test\soak`
1. Run the script - `soak_monitor.bat [url]`
1. Follow the prompts to start the script.
    1. When you see the message `Starting Monitor` and an ascii spinner `[\]`, the monitoring script is running
1. Set up the wall/s as necessary
    1. 18 static HQ streams
1. Allow the test to run for 24 hours (or however long the soak test needs to be)
1. `ctrl+c` to initiate the termination logic
1. `n` followed by enter
    1. Do NOT terminate the running process.  it will terminate itself.  there is specific clean up logic that needs to run
1. Be sure to note any information you need, such as the location of the current monitoring output
1. Follow the prompts to close the command window

### Chrome remote debugging

See the "Chrome Remote Debugger Address" output when the script runs.  It will tell you the address and port to use for the remote debugger.  This should be run on a separate computer on the same subnet.

### Accessing the monitoring output

The monitoring output will be a csv file that gets created in the directory in which the `soak_monitor.bat` script is run.  Each new monitoring output csv file has a timestamp on it.  The output of the running script will tell you which file corresponds to the currently-running monitoring session.

## References

* [https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/typeperf#BKMK_EXAMPLES](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/typeperf#BKMK_EXAMPLES)
* [http://steve-jansen.github.io/guides/windows-batch-scripting/part-7-functions.html](http://steve-jansen.github.io/guides/windows-batch-scripting/part-7-functions.html)
* [https://peter.sh/experiments/chromium-command-line-switches/](https://peter.sh/experiments/chromium-command-line-switches/)
