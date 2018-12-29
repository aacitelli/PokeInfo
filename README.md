# PokeINFO

PokeINFO is a website I made over winter break that basically reads in data from PokeAPI's RESTful API and formats it in an easy-to-read way on a webpage. It was built responsively using media queries and was my first huge foray into JavaScript, although I'd already done quite a bit of work with it. 

All source code is obviously in this repo. When the project is finished (which is probably will be by the end of christmas break), a usable page will be up on it at aacitelli.github.io, my portfolio website. 


#### Future Work
This project is still actively in development. It's not yet complete, but at this point, I've stopped learning as quickly and it's mostly just reimplementation of some stuff I've already figured out, extra features, and making the static site elements look better while remaining responsive across devices mostly via CSS. 

## **What I Learned: Major Points**

### ***Fetch & Promises*** 

I figured out how to implement a system of getting JSON data from PokeAPI and setting information on a page based on that data, all using fetch(), a new standard for getting API data. 

PokeAPI returns a lot of URLs in their JSON data, which I was able to use to get further information on specific aspects of the data (like additional move information, flavor text, and a whole lot more), again using fetch(). 

I learned a lot about what promises are, when they need to be implemented, and how to actually implement them effectively, mostly with respect to fetch(). I was able to use them to only request certain data whenever other data came in, due to how one set of data required data from the other to be obtained. 

### ***Asynchronous Processes***

I got way deeper into asynchronous processes and how they work than I thought I would. I ended up having to implement the "async" and "await" keywords for some of my data and got a fair understanding of them. 

### ***JSON data***

I learned a lot about JSON data and the minor differences between it and actual JavaScript objects. I got very good at being able to look at documentation and implement how to get a single piece of data from read-in JSON data, which was basically the foundation for this entire project. 

### ***The HTML DOM***

The entire last half of this project is basically just taking the parsed-in JSON data and outputting the results onto the page dynamically using the DOM. I got lots of valuable experience with the general procedure of defining elements, giving them values and styling dependent on some stuff, then adding them to the actual page.

## **What I Learned: Minor Points**

### ***Arrays (in JavaScript)***

There was a ton of work I had to do with arrays due to all the lists involved. I was already pretty experienced with them due to my experience with other programming languages, but I got adjusted pretty quickly to JavaScript's quirks and associated functions like slice/splice and others.

### ***Error Reporting***

I got good experience with throwing and catching errors, and built this project with having pretty good error reporting in mind, and it honestly made development a lot faster.

### ***Adapting to Other Languages***

Traditionally, I've mostly worked with Java and, more recently, C/C++. I got good experience applying concepts from other languages (general language elements and syntax). Learning JavaScript was less learning the programming concepts and more just adjusting to JavaScript's syntax and the way it does things. 
