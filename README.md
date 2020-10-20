# js-apis

Link to live: http://nostalgic-shake.surge.sh/

In this project we were supposed to be creating a single page application where the user could visit multiple sites while actually staying on the same page. This can be achieved by using the history API. I wanted to create an app where you could view a collection of games and if you'd click on a specific game you would be taken to another page where you could see that game's info and a minimized version of your game collection. I probably could have made the game details 'page' look more different than the root page but at least the header and background color changes :).

How the flow of this thing works:
The root page creates a grid of games from the game list.
When a specific game is clicked two things happen:
First the handleGameClick() is run and preventDefault() is called to prevent the link navigating to another place. The correct game id is retrieved from the data-game attribute of the current link clicked and is then placed in the url via pushState(); The function does not pushState if the current path name is the same as the target path name.
Second thing that happens is the game grid takes on a different style and shows a smaller version of itself. A more detailed info on the game clicked is also shown above the list. There is also a 'Back to menu' link that calls pushState again with the root as the destination.

Each time the user presses the back button in the browser the popState event is fired and updates the game info with the current history state as long as the path isn't the root, in which case the game list takes on it's 'home' page form and the info is hidden.

As a bonus the game list can be filtered by showing games that have the single- or multiplayer properties as true, or it can be sorted by genre. The genre drop down list gets updated depending on what games are being shown. I used local storage to store the filtered game list
so that if the user revisits the site, it will use that list to display.

The comments might be a little chaotic but I kinda wanted to keep them in the js file incase I needed them if I revisited this guide in the future.