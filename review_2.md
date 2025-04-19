The exact implementation cannot be found online or Google-able, but a similar Java task based on ConcurrentHashmap was discussed on StackOverflow.

ChatGPT was able to provide an identical ideal response (about 85-90% similar)


Dependency error. The model wrote code that uses the async-mutex library, but this library wasn't installed.







The task is looking fine. Does not seems like there is any issue in the prompt.





I reviewed the task:
- The prompt is good as per "Turing's Comments" 
- The `async-mutex` library is not used in any of the code (base code, model response, incorrect solution or ideal solution).
- The Model D used `async-lock` library in the code, which is included in "Installed Packages" section.
I don't think we need to change anything in the task.

Dependency error. The model wrote code that uses the async-mutex library, but this library wasn't installed.