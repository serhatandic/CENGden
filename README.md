I set the authentication token at 14.04.2024, it has 30 days till expiration, if it expires it may cause error related to authentication. I will try to update it throughout the semester but in case you encounter errors related to authentication it would be great if you reached me before giving the final grade.

TODO: provide 1 admin user, 1 normal user account credentials so that assistant can test

TODO: explain each component, what they do etc.

TODO: hrefs can be fixed but not too important

TODO: some fields in some views are not visible, that should be fixed

TODO: test the app

TODO: provide all the endpoints

TODO: phone number shouldn't be visible to the non-authenticated users

The project consists of 3 parts: Frontend, Backend server, Database.

On the database part i have a single database with 4 collections. These collections are: "UserFavorites", "Items" and "FavoritedBy".

-   Items collection is used to store the posts
-   UserFavorites collection is used to store the favorited items by a user. The favorited items are kept in an array.
-   FavoritedBy collection is used to keep track of the users who favorited a post. This collection is used for sending emails on a price drop to the users who favorited a post.

On the frontend part i used react.js as the framework and material-ui as the component library. Text-fields, navbar, buttons etc. are ready to use components from material-ui. React.js is used to manage the state of the components and to organize the gui of the app. The reason i choosed this stack is that i already had a considerable amount of experience using them.

I managed the whole authentication logic on the frontend app. There is a login button on the navbar and upon login i get the user's credentials and its role and then pass it down the component tree to every component that need the authentication information. I decide whether i should render a view using this authentication and role information. For if the user is not authenticated he/she won't be able to see the add post button, even if he/she tries to go to the url directly the view won't be shown, instead a message is displayed stating there is a problem in authentication. I only allowed registration from .ceng.metu.edu.tr domain, if any other domain is used an error is displayed. (I couldn't manage to display a custom error message but if you check the network tab for the corresponding request you can see the custom error message i tried to display)

On the home page i render all the postings using pagination. Every page has 10 posting. I also handled the pagination logic on the frontend side using a ready to use component from material-ui. On this page there is a filtering option, user can choose a category and the items will be filtered accordingly. The filter mechanism works as follows: after user chooses a filter a request is sent to the backend server, backend server takes the request and forms a query, using this query it sends a request to mongodb. And then the result is transmitted back to the frontend app. Using this result ui is updated. It was not too hard to implement the feature thanks to ease of use of query mechanism of mongodb.

Each post on the home page has a title, description and a category. Also there are edit, delete (these two are only shown if you are the post owner), favorite and read more options.

-   Edit button redirects the user to a new view, this view is identical to add view. User updates whatever he/she wants and submits it. After submission the user is redirected to the home page and the post is updated. For this feature i send a put request to a backend endpoint ("/api/item/:itemId"), the endpoint takes the request queries the db to find the item and then updates it with the new info.

-   Delete button sends a request to a backend endpoint ('/api/item/:itemId'). This endpoint uses deleteOne method of the database to delete the item.

-   Favorite button sends a put request to the backend endpoint "/api/items/user/:userId/favorites/:itemId". If the user doesn't have any favorited items than a new array is created in the 'UserFavorites' collection. Otherwise the array is queried and the item (post) is added to the favorites. After the favorite is added ui is updated to show the post as favorited. If user clicks the button again a delete request is sent to the backend endpoint '/api/items/:itemId/user/:userId/favorites'. This endpoint queries the users favorites array and removes the corresponding item.

-   Read more button redirects the user to the details view for the corresponding item. In this view all the details about the post can be seen.

-   There is a add post button on the navbar, when the button is clicked user is redirected to the add post view. In this view user is asked to choose a category, after a category is chosen the fields for that category is shown. After the user fills each field he/she can submit the form. After submission a post request is sent to the "/api/items" endpoint and the user is redirected to the home page. The endpoint inserts the item to the database collection "Items"

-   If user click's the part where the user icon is shown, he/she is redirected to the profile page. In this page user can see the profile details and also the posts that he/she shared. Profile details can be edited, user should just click the edit profile button and the fields become editable. After user edits the fields and saves the changes, the information is updated (a request is sent to the auth0 api for this purpose). In this page user can activate / deactive posts. Deactivated posts are not shown to other users. Upon clicking activate / deactivate buttons a put request is sent to the "/api/item/:itemId" endpoint. This endpoint queries the db collection "Items" to find the corresponding item and then updates it with this new information.
