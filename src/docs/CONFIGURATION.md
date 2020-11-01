
## How to configure the script

- ### Change instagram username
  1. Go to the src folder
  2. Open the config.js file
  3. Change the profileUsername variable to your instagram username without the @ symbol

- ### Change the colors
  1. Go to the src folder
  2. Open the variables.scss file
  3. Change any color variable you want

- ### Add your own logo
  1. Upload your logo on the assets folder inside the src folder
  2. Then go to src > components > Sidebar and open the Sidebar.js
  3. On the 4th line import Logo from "../../assets/Logo.svg" change the Logo.svg to your logo name
  4. Do the same on the src > pages > Dashboard and open the Dashboard.js and do the change on the 11th line.

- ### Set your ads
  1. Go to the src > components > FixedAd and open the FixedAd.js
  2. There you can set up your own ad.
  3. Same for square ad, go to src > components > SquareAd and open SquareAd.js and put your ad inside the div. 

- ### Change your email

1. Go to src > containers > AdsContainer and open AdsContainer.js
2. On the line 43rd line change the mailto: to your email address.