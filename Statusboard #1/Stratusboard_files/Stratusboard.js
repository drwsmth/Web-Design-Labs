// Created by iWeb 3.0.2 local-build-20110110

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({shadow_0:new IWShadow({blurRadius:0,offset:new IWPoint(0.0000,-1.0000),color:'#000000',opacity:0.750000}),shadow_3:new IWShadow({blurRadius:0,offset:new IWPoint(0.0000,-1.0000),color:'#000000',opacity:0.750000}),shadow_1:new IWShadow({blurRadius:0,offset:new IWPoint(0.0000,-1.0000),color:'#000000',opacity:0.750000}),shadow_4:new IWShadow({blurRadius:0,offset:new IWPoint(0.0000,-1.0000),color:'#000000',opacity:0.750000}),shadow_2:new IWShadow({blurRadius:0,offset:new IWPoint(0.0000,-1.0000),color:'#000000',opacity:0.750000}),stroke_0:new IWEmptyStroke()});registry.applyEffects();}
function hostedOnDM()
{return true;}
function onPageLoad()
{loadMozillaCSS('Stratusboard_files/StratusboardMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');detectBrowser();fixAllIEPNGs('Media/transparent.gif');Widget.onload();fixupAllIEPNGBGs();applyEffects()}
function onPageUnload()
{Widget.onunload();}
