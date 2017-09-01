
<html>
<head>
<!-- For ease i'm just using a JQuery version hosted by JQuery- you can download any version and link to it locally -->
<script src="jquery-1.3.2.min.js"></script>

<script>
 $(document).ready(function() {
 	 $("#responsecontainer").load("response.php");
   var refreshId = setInterval(function() {
      $("#responsecontainer").load('response.php?randval='+ Math.random());
   }, 9000);
});
</script>
</head>
<body>

<div id="responsecontainer">
</div>
</body>