dnl Requires _SCRIPT macro to be an executable that prints xhtml to stdout.
dnl
<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
	    font-family: sans-serif;
		font-size: 10pt;
	}
	
    ul {
        padding: 0;
        margin: 0;
    }
    
    li:hover {
        background: black;
        color: white;
        cursor: pointer;
    }

    h3 {
        margin-bottom: 0.5em;
        margin-top: 0px;
    }

    hr {
       height: 1px;
       border-style: none;
	   background-color: #C0C0C0;
    }
  </style>

</head>
<body>
  <h3>Extract Cache From</h3>
  
syscmd(_SCRIPT)

  <script src="lib/popup.js"></script>
</body>
</html>
