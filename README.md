# Improve Outstream

This is an attempt to build an outstream advertising solution based on G IMA SDK.

## Getting Started

You need to have <b>python</b> and </b> <b>flask</b> installed, which is used to setup a local server.  
  
Once python is on your machine, run:

```
pip install Flask
```

Once in the downloaded directory, launch the solution with the following command:

```
python app.py 
```
See an animated result here: https://github.com/wlixw/improve_outstream/blob/master/static/intro.gif 

## Solution

```
The main logic is to be found in the ads.js file 
-> Needs to be exported in the library solution.
```

Currently the solution uses : 

- The Intersection Observer API (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), in order to trigger user interaction when the main container enters the viewport by crossing its edges. 

One clear issue here, is that we are using the <i>IsIntersecting</i> entry, and that means every time the viewport intersects the container at its upper and lower edges, the playAd is triggered, which isn't ideal as it restarts the ad. This might also be easy to fix by calling the function once (one of those things I don't know yet how to do elegantly in JS). 

We might still have to look at other methods, as we might also want to bind the adsManager.pause() method of IMA SDK to any user interaction that would set focus out away from the ad as it is the case in most outstream/in-read solutions I have seen showcased in the web. 

## Improvements needed

```
Ima3.js (easy)
```

Bringing the ima3.js script in the ads.js file (shame on me). I tried onload methods, but got errors [this should be easy for experienced people]. I see there are different methods to do that, but was unlucky with the first attempts.

```
Multiple Requests
```
I have set up a long html page where multiple containers could be set-up, but still need to implement the logic for several adSlots. Need to bind the Intersection Observer to several Divs.

 ```
Muted Ad 
```

I have read it is good practice to play ad muted and allow user interaction to unmute. It seems it is possible to play ad muted, but I am not sure how to manage that at the moment and lines 150-151 do not seem to be the right method.

```
Mobile
```

I usually am able to reproduce the ad on mobile with USB Debugging. There are some aspects (stability of the solution) that need to be adressed. Help here might be needed to compare across devices.

