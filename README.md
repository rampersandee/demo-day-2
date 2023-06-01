### Goal: Create a personal app that has two or more CRUD features.

### Process:

<ol>
  <li>Man oh man, what a joy, what a pain, what a time.</li>
  <li>This was my baby that I watched grow from a little fledging to a full-grown hawk.</li>
  <li>Concept is simple; create an app that helps combat food deserts by using the user's location to find the closest stores and display their prices.  No big deal, right?</li>
  <li><strong>WRONG.</strong>I had a pull an entire API out of my rear end--I could NOT for the life of me find an API that provided the pricings of common foods for local grocery stores.</li>
  <li>My solution was to create this <em>massive</em> object (it had about 950 lines of code) inside of my routes file so I could access the data that I had webscrapped.  That took me one and a half days, so at the end of that ordeal, nobody could tell me ****--I will get it <em>done</em>.  Period.</li>  
   <li>After constructing that huge object, then began the work of connecting my data to the Mapbox API I was using to display the user and store's locations.</li>
  <li>The user location was simple.  Once the user creates an account for the app, I have the user zipcode sent to my database to be used to place the user on the map using a fetch request in my main.js.  Additionally, I made a singular marker on the map to have the user's location be the focus, opting for a red color so no matter how far the user zoomed, they would have a solid idea of where they are on Earth.</li>
  <li>Then, I implemented a Mapbox pop-up that displayed the relevant data that was fetched from my massive object.  I had two different get methods--one for getting the entire object and another that filtered based on a user input.  For example, if the user wrote 'chicken,'  I had an auto complete that would pull up all options for chicken i.e thighs, wings, and so on.</li>
  <li>Before hand, the map had 6 markers, one for each of the stores in my object.  Let's actually show you an example of the object:<br><pre>
```
const groceryStores = [
  {
    name: "Aldi",
    products: [
      { name: "chicken", price: 5.99 },
      { name: "greens", price: 2.49 },
      { name: "eggs", price: 1.99 }
    ]
  }
];
</pre>
    Try doing that 900+ times.</li>
  <li>Anywho, the 6 markers are for each of my stores (Aldi, Kroger, Publix, Walmart, and Trader Joe's) and my user location (based on the zipcode from earlier).  Once the user completes the search, however, additional store markers would pop up based on actual store locations near the user.  This was another fetch that was run through another API that used some reverse geocoding to find the longitude and latitude of a store location so I could display it on the map.</li>
  <li>But it wasn't just about displaying data. I wanted to give users the power to delete items as well. So, I implemented a delete method to clear the saved addresses and let the user start fresh.</li>
   <li>And for my styling?  I ate that up--no template because I'mma boss.  Even a couple of animations in there to really spice up the look of the app and make it a bit more inviting.</li>
   <li>But you know what? I'm not completely done with this project. I have this idea for coloring the user's favorite stores gold.  I also want to have the user be able to adjust their zipcode so they are not hardstuck to one particularly focal point on the map and as 'fun' as it was to create a gargantuan 900-line code object, I would much rather have used an API, so the real-real world applications could be shown.</li>
  <li>All in all, though, done and dusted.</li>
</ol>

<p>Overall, I'm proud of the work I did.  I made something from nothing because I needed the data and that alone makes me happy.  This project can go places--just wait till I get my hands on that Instacart APT.</p>

<ul>
  <li>I completed the challenge: | <strong>5</strong> <em>My CRUDs are in there; check 'em and see.</em></li>
  <li>I feel good about my code: | <strong>3</strong> <em>I feel like I could do a bit more with this.  I want a easier way to change the colors of the the markers on the map aside from hardcoding it.  Additionally, I just want an API to draw data from.</em></li>
</ul>
