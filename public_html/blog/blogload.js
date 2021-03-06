// This is a simple file to read XML and then return some data, which is then processed through 
// another function and turned to HTML that can be included in the file.

function blog_load(entry, callback) {
    // Returns an entry's document contents.
    $.get("entries/" + entry + ".xml", function(response) {
        callback(response);
    });
}

function blog_load_html(entry, callback) {
    // Returns the HTML that would compose an entry.
    blog_load(entry, function(response) {
        var header = $(response).find("blogheader").text();
        var $contents = $(response).find("blogcontents");
        var contents = "";
        contents = get_contents($contents);
        callback(""
            +"<div class='entry'>"
            +"<h1 class='entry-header'><a name='"+entry+"' href='#"+entry+"'>"+header+"</a>"+"<span style='float:right;margin-right:20px;'>#"+entry+"</span></h1>"
            +"<pre class='entry-contents'>"+contents+"</pre>"
            +"</div>");
    });
}

function get_contents(xml) {
    var res = $(xml).text().split('\n');
    var incode = false;
    $.each(res, function(i) {
        if(!incode)
            res[i] = res[i].trim();
        else
            res[i] = res[i].substr(8);
        if(res[i].replace(/ /g, '') === '```')
            incode = !incode;
    });
    res = res.join('\n');
    res = marked(res);
    return res;
    
    /*
    // Remove any tags from the XML inputted and turn in to a markdown string.
    var output = "";
    for (var i = 0; i < xml.length; i++) {
        if (xml[i].nodeValue !== null) {
            output += xml[i].nodeValue;
        } else {
            output += get_contents(xml[i].childNodes);
        }
    }

    output = marked(output);
    return output;
    */
}