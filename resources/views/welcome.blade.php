<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kija Maharjan - Fullstack Developer & UI Designer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/web.css', 'resources/js/web.js'])
</head>
<body>
    @include('nav')
    @include('hero')
    @include('about')
    @include('services')
    @include('projects')
    @include('certificates')
    @include('contact')
    @include('footer')
    @include('cursor')
</body>
</html>
