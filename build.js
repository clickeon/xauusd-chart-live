const { PythonShell } = require('python-shell');
const fs = require('fs');
const path = require('path');

// Create netlify/functions directory if it doesn't exist
const functionsDir = path.join(__dirname, 'netlify', 'functions');
if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true });
}

// Install Python dependencies
const options = {
    mode: 'text',
    pythonPath: 'python3',
    pythonOptions: ['-u'], // unbuffered output
    scriptPath: __dirname,
    args: ['-m', 'pip', 'install', '-r', 'requirements.txt']
};

PythonShell.run('python3', options, function (err, results) {
    if (err) {
        console.error('Error installing Python dependencies:', err);
        process.exit(1);
    }
    console.log('Python dependencies installed successfully');
}); 