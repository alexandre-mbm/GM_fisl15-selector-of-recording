// ==UserScript==
// @name        FISL15's Selector of Recording
// @namespace   http://userscripts.org/users/69817
// @include     http://papers.softwarelivre.org/papers_ng/public/new_grid*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1
// ==/UserScript==

/*

Copyright (c) 2014 Alexandre Magno <alexandre.mbm@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

function createLink(element, content, filename) {
    var value = (window.btoa?'base64,'+btoa(''):'');
    $(element).append($('<a>'+content+'</a>')
        .attr("href", 'data:text/plain;' + value)
        .attr("download", filename)
        .click(function(){
            var text = contentForFile(filename);
            var text_base64 = btoa(unescape(encodeURIComponent(text)));
            value = (window.btoa?'base64,'+text_base64:text);
            $(this).attr("href", 'data:text/plain;' + value);
        })
    );
}

function contentForFile(filename) {
    var sum = '';

    switch(filename) {
        case 'playlist.m3u':
            sum = sum + '#EXTM3U' + '\n\n';
            break;
    }
    
    $(".recording").each( function() {
        //console.log(this.parentNode.innerHTML);
        var area = stripText($(".area", this.parentNode).text());
        var title = stripText($(".title", this.parentNode).text());
        var author = stripText($(".author", this.parentNode).text());
        var link = $("a", this).eq(0).attr('href');
        var action = $("a", this).eq(1).text();
        //console.log(link.text());
        if (action == 'remover') {
            switch(filename) {
                case 'playlist.m3u':
                    sum = sum + '#EXTINF:-1,' + author + ' - '+ title + '\n';
                    sum = sum + link + '\n';
                    sum = sum + '\n';
                    break;
                case 'talks.txt':
                    chs = title.replace(/./g,'-');
                    sum = sum + title + '\n';
                    sum = sum + chs + '\n';
                    sum = sum + '\n';
                    sum = sum + '  (' + area + ')' + '\n';
                    sum = sum + '\n';
                    sum = sum + '    ' + author + '\n';
                    sum = sum + '\n';
                    sum = sum + '  ' + link + '\n';
                    sum = sum + '\n\n'; 
                    break;
                case 'links.txt':
                    sum = sum + link + '\n';
                    break;
            }
        }
    });
    
    return sum.replace(/\n+$/g,''); 
}

function stripText(value) {
    value = value.replace(/ + ?/g, ' ');
    value = value.replace(/\n/g, '');
    value = value.replace(/^ /g, '');
    value = value.replace(/ $/g, '');
    return value;
}

var selectVideo = function () {
    if($(this).text() == 'adicionar') {
        this.innerHTML = '<b>remover</b>';
        $(this).css({color:'red'});        
    } else{
        this.innerHTML = 'adicionar';
        $(this).css({color:'#428BCA'});
    }
}

function addActionIn(divRec) {
    $(divRec).append( $('<a></a>')
        .click(selectVideo)
        .text('adicionar')
    );
}

$(".recording").each( function() {
    addActionIn(this);
});

var bar = $("#topBar small");
bar.text('');
bar.append('download: ');
createLink(bar, 'm3u', 'playlist.m3u');
bar.append(' ');
createLink(bar, 'txt', 'talks.txt');
bar.append(' ');
createLink(bar, 'wget', 'links.txt');
bar.css('margin-top','10px');

function addAll() {    
    $(".recording").each( function() {
        var elemento = $('a',this.parentNode).eq(1);
        if(elemento.text() == 'adicionar') {
            elemento.html('<b>remover</b>');
            elemento.css({color:'red'});        
        }
    });
}

function removeAll() {    
    $(".recording").each( function() {
        var elemento = $('a',this.parentNode).eq(1);        
        if(elemento.text() != 'adicionar') {
            elemento.html('adicionar');
            elemento.css({color:'#428BCA'});       
        }
    });
}

GM_registerMenuCommand("Adicionar tudo", addAll);
GM_registerMenuCommand("Remover tudo", removeAll);

/*
    <div data-slot-id="421" class="slot grid-col-10 grid-width-120 zone-16">
        <div class="area">
            Ecossistema / Cultura
        </div>
        <div class="title">
            Morreu o Movimento Software Livre no Brasil?
        </div>
        <div class="author">
            Alexandre Oliva
        </div>
        <div class="recording">
            <a href="http://hemingway.softwarelivre.org/fisl15/high/41a/sala41a-high-201405081002.ogv" target="_blank">gravação</a>
        </div>
    </div>
*/

// Adicionar tudo
// Remover tudo

$('#header, #footer, #search-bar')
    .css({
                 'display':'none',
              'box-sizing':'content-box',
            'border-width':'0px',
                   'width':'auto',
                  'height':'auto'
    });

$('html, body, #content, #container, #wrapper')
    .css({
                'margin':'0px',
               'padding':'0px',
            'box-sizing':'content-box',
          'border-width':'0px',
                 'width':'auto',
                'height':'auto'
    });

/* Evitar que clique no link faça clique para tooltip */
var stylesheet = $('<style type="text/css" media="screen" />');
stylesheet.html('#slot-popup-container{display:none!important;}');
$('body').append(stylesheet);

