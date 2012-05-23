dnl Requires _SCRIPT macro to be an executable that prints xhtml to stdout.
dnl
<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    ul {
        padding: 0;
        margin: 0;
    }
	
    li:hover {
        background: black;
        color: white;
        cursor: pointer;
    }
  </style>

</head>
<body>
  <h3>Extract From</h3>
  
  syscmd(_SCRIPT)

  <script src="popup.js"></script>
</body>
</html>
