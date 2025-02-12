The `TextFormatter` class is for formatting text into different casings. 
I want you to improve it by implementing `chainFormat` which takes the text and list of formatters and allows one to apply multiple formatters to a text. 

The formatters is a list of formats which has a `name` and `options`. 

Also, i want you to add a feature to register a custom formatter, `registerFormatter` which takes the name and function to apply the format. 

Improve the `registerDefaultFormatters` method by including a formatter for `camel` case. 

Implement a `removeFormatting` functionality for removing an applied formatting. 

It takes the text and options needed to be removed. 

Options may include any of the formatters applied as well as `case` and `spaces` which removes upper case and spaces respectively. 

Also the options is an object.

Lastly, implement a feature to register a pattern, `registerPattern` which takes the name, pattern and replacement. Formatters must be unique and patterns should be regular expressions. For any error, the error message should be "an error occurred". Maintain existing api structure.

Examples
If a camel case of "comeHomeBoy" is removed, the answer should be "come Home Boy".
For alternating case of "lOVe CoDiNg" when removed should be "love coding"
For spaces removal at most one space should be between each word in a sentence.
For snake case of "come_home_son" when removed should be "come home son".

