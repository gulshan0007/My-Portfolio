// Terminal functionality
class Terminal {
    constructor() {
        this.currentCommand = '';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isTyping = false;
        this.terminalContent = document.getElementById('terminal-content');
        this.currentCommandElement = document.getElementById('current-command');
        this.cursorElement = document.getElementById('cursor');
        
        this.commands = {
            'dir': this.listFiles.bind(this),
            'ls': this.listFiles.bind(this),
            'help': this.showHelp.bind(this),
            'cls': this.clearTerminal.bind(this),
            'clear': this.clearTerminal.bind(this),
            'personal': this.openPersonal.bind(this),
            'experience': this.openExperience.bind(this),
            'projects': this.openProjects.bind(this),
            'awards': this.openAwards.bind(this),
            'about': this.openPersonal.bind(this),
            'resume': this.openResume.bind(this),
            'portfolio': this.openPortfolio.bind(this),
            'contact': this.showContact.bind(this),
            'skills': this.showSkills.bind(this),
            'echo': this.echo.bind(this),
            'ver': this.showVersion.bind(this),
            'time': this.showTime.bind(this),
            'date': this.showDate.bind(this)
        };
        
        this.init();
    }
    
    init() {
        // Welcome message - Windows CMD style
        
        this.addLine('Welcome to Gulshan\'s Portfolio Terminal!');
        this.addLine('Type "help" to see available commands.');
        this.addLine('');
        this.showPrompt();
        
        // Focus on terminal
        // Focus on terminal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.terminal')) {
                this.focus();
                // Add mobile keyboard support
                const terminalInput = document.getElementById('terminal-input');
                if (terminalInput) {
                    terminalInput.focus();
                }
            }
        });
        
        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.isTyping) return;
            
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'Backspace') {
                this.handleBackspace();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // Prevent default arrow key behavior
                e.preventDefault();
            } else if (e.key.length === 1) {
                this.addCharacter(e.key);
            }
        });
        
        // Auto-focus terminal on page load
        setTimeout(() => {
            this.focus();
        }, 500);
    }
    
    focus() {
        // Ensure cursor is visible and blinking
        if (this.cursorElement) {
            this.cursorElement.style.animation = 'blink 1s infinite';
        }
        
        // Focus the hidden input for mobile keyboard
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.focus();
        }
    }
    
    addCharacter(char) {
        this.currentCommand += char;
        if (this.currentCommandElement) {
            this.currentCommandElement.textContent = this.currentCommand;
        }
    }
    
    handleBackspace() {
        this.currentCommand = this.currentCommand.slice(0, -1);
        if (this.currentCommandElement) {
            this.currentCommandElement.textContent = this.currentCommand;
        }
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.currentCommand = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            }
        } else {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.currentCommand = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            } else if (this.historyIndex === 0) {
                this.historyIndex = -1;
                this.currentCommand = '';
            }
        }
        
        if (this.currentCommandElement) {
            this.currentCommandElement.textContent = this.currentCommand;
        }
    }
    
    executeCommand() {
        const command = this.currentCommand.trim();
        
        if (command === '') {
            this.showPrompt();
            return;
        }
        
        // Clear the input field before replacing the line
        if (this.currentCommandElement) {
            this.currentCommandElement.textContent = '';
        }
        // Add to history only if different from last command
        if (this.commandHistory.length === 0 || this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
        }
        this.historyIndex = -1;
        
        // Replace the LAST current input line with a static prompt+command (no cursor)
        const currentLines = this.terminalContent.querySelectorAll('.current-line');
        if (currentLines.length > 0) {
            const lastCurrentLine = currentLines[currentLines.length - 1];
            lastCurrentLine.innerHTML = `<span class="prompt">C:\\Users\\Gulshan\\Portfolio&gt;</span><span class="command">${command}</span>`;
            lastCurrentLine.classList.remove('current-line');
        }
        // Add a blank line for spacing
        this.addLine('&nbsp;');
        
        // Parse command and arguments
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        // Execute command
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.addLine(`'${command}' is not recognized as an internal or external command,`);
            this.addLine('operable program or batch file.');
        }
        
        this.currentCommand = '';
        // Always show new prompt after command execution
        this.showPrompt();
    }
    
    addLine(content) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-output">${content}</span>`;
        this.terminalContent.appendChild(line);
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }
    
    showPrompt() {
        // Remove .current-line from all previous lines
        const previousLines = this.terminalContent.querySelectorAll('.current-line');
        previousLines.forEach(line => line.classList.remove('current-line'));
        // Remove all previous cursors
        document.querySelectorAll('.cursor').forEach(c => c.remove());
        // Add the new prompt
        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line current-line';
        promptLine.innerHTML = `<span class="prompt">C:\\Users\\Gulshan\\Portfolio&gt;</span><span class="command" id="current-command"></span><span class="cursor" id="cursor">_</span>`;
        this.terminalContent.appendChild(promptLine);
        // Use promptLine.querySelector to get the correct elements
        this.currentCommandElement = promptLine.querySelector('#current-command');
        this.cursorElement = promptLine.querySelector('#cursor');
        if (this.cursorElement) {
            this.cursorElement.style.animation = 'blink 1s infinite';
        }
        this.scrollToBottom();
    }
    
    // Command implementations
    listFiles() {
        this.addLine('Volume in drive C has no label.');
        this.addLine('Volume Serial Number is 1234-5678');
        this.addLine('');
        this.addLine('Directory of C:\\Users\\Gulshan\\Portfolio');
        this.addLine('');
        
        const currentDate = new Date().toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        });
        const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        this.addLine(`${currentDate}  ${currentTime}    &lt;DIR&gt;          personal`);
        this.addLine(`${currentDate}  ${currentTime}    &lt;DIR&gt;          experience`);
        this.addLine(`${currentDate}  ${currentTime}    &lt;DIR&gt;          projects`);
        this.addLine(`${currentDate}  ${currentTime}    &lt;DIR&gt;          awards`);
        this.addLine(`${currentDate}  ${currentTime}    &lt;DIR&gt;          contact`);
        this.addLine(`${currentDate}  ${currentTime}    &lt;DIR&gt;          skills`);
        this.addLine(`${currentDate}  ${currentTime}         2,048 resume.pdf`);
        this.addLine(`${currentDate}  ${currentTime}         1,024 portfolio.pdf`);
        this.addLine('               6 Dir(s)     2,048 bytes');
        this.addLine('               2 File(s)    3,072 bytes free');
    }
    
    showHelp() {
        this.addLine('For more information on a specific command, type HELP command-name');
        this.addLine('');
        this.addLine('CLS        Clears the screen.');
        this.addLine('DIR        Displays a list of files and subdirectories in a directory.');
        this.addLine('ECHO       Displays messages.');
        this.addLine('HELP       Provides Help information for Windows commands.');
        this.addLine('TIME       Displays or sets the system time.');
        this.addLine('DATE       Displays or sets the date.');
        this.addLine('VER        Displays the Windows version.');
        this.addLine('');
        this.addLine('Portfolio specific commands:');
        this.addLine('PERSONAL   View personal details');
        this.addLine('EXPERIENCE View work experience');
        this.addLine('PROJECTS   View portfolio projects');
        this.addLine('AWARDS     View awards and certifications');
        this.addLine('SKILLS     View technical skills');
        this.addLine('CONTACT    View contact information');
        this.addLine('RESUME     Open resume file');
        this.addLine('PORTFOLIO  Open portfolio file');
    }
    
    clearTerminal() {
        this.terminalContent.innerHTML = '';
    }
    
    echo(args) {
        if (args.length === 0) {
            this.addLine('ECHO is on.');
        } else {
            this.addLine(args.join(' '));
        }
    }
    
    showVersion() {
        this.addLine('');
        this.addLine('Microsoft Windows [Version 10.0.19045.3570]');
        this.addLine('Portfolio Terminal v1.0 - Gulshan\'s Interactive Resume');
    }
    
    showTime() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
        this.addLine(`The current time is: ${time}`);
    }
    
    showDate() {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.addLine(`The current date is: ${date}`);
    }
    
    openPersonal() {
        this.addLine('Opening personal details...');
        setTimeout(() => {
            document.getElementById('personal-modal').style.display = 'block';
        }, 500);
    }
    
    openExperience() {
        this.addLine('Opening experience details...');
        setTimeout(() => {
            document.getElementById('experience-modal').style.display = 'block';
        }, 500);
    }
    
    openProjects() {
        this.addLine('Opening projects...');
        setTimeout(() => {
            document.getElementById('projects-modal').style.display = 'block';
        }, 500);
    }
    
    openAwards() {
        this.addLine('Opening awards and certifications...');
        setTimeout(() => {
            document.getElementById('awards-modal').style.display = 'block';
        }, 500);
    }
    
    showContact() {
        this.addLine('Contact Information:');
        this.addLine('');
        this.addLine('Email: gulshan.iitb@gmail.com');
        this.addLine('Phone: +91 6202712403');
        this.addLine('Location: India');
        this.addLine('LinkedIn: <a href="https://www.linkedin.com/in/gulshan-kumar-69b54b25b/" target="_blank">linkedin.com/in/gulshan-kumar-69b54b25b</a>');
        this.addLine('GitHub: <a href="https://github.com/gulshan0007" target="_blank">github.com/gulshan0007</a>');
    }
    
    showSkills() {
        this.addLine('Technical Skills:');
        this.addLine('');
        this.addLine('<b>Programming Languages:</b> Python, C++, Java, JavaScript, TypeScript, HTML, CSS, SQL, R');
        this.addLine('<b>ML & AI:</b> Transformers, LangChain, Hugging Face, GANs, YOLO, Computer Vision, NLP, Deep Learning');
        this.addLine('<b>Web:</b> React, React Native, Next.js, Django, Flask, Node.js, Express.js, REST APIs, Socket.IO, WebRTC');
        this.addLine('<b>Cloud & DevOps:</b> AWS, Google Cloud Platform (GCP), Vertex AI, Docker, Linux, Nginx, Apache, CI/CD');
        this.addLine('<b>Databases & Tools:</b> PostgreSQL, MySQL, MongoDB, Redis, Git, GitHub, Postman, Jupyter, VS Code');
    }
    
    openResume() {
        this.addLine('Opening resume file...');
        this.addLine('');
        this.addLine('Resume file: gulshan_resume_final.pdf');
        this.addLine('Click to download: <a href="gulshan_resume_final.pdf" download style="color:#00ff00;text-decoration:underline;">gulshan_resume_final.pdf</a>');
    }
    
    openPortfolio() {
        this.addLine('Opening portfolio files...');
        this.addLine('');
        this.addLine('Available portfolios:');
        this.addLine('- <a href="Dev Portfolio.pdf" download style="color:#00ff00;text-decoration:underline;">Dev Portfolio.pdf</a> (Development projects)');
        this.addLine('- <a href="ML Portfolio.pdf" download style="color:#00ff00;text-decoration:underline;">ML Portfolio.pdf</a> (Machine Learning projects)');
    }
}

// Modal functionality
class ModalManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
        
        // Close modal with X button
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal[style*="display: block"]');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }
    
    closeModal(modal) {
        modal.style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
    new ModalManager();
    
    // Add some interactive effects
    const idCard = document.querySelector('.id-card');
    const profileImage = document.querySelector('.profile-image');
    
    // Enhanced hover effects
    if (profileImage) {
        profileImage.addEventListener('mouseenter', () => {
            if (idCard) {
                idCard.style.transform = 'scale(1.02) rotate(1deg)';
            }
        });
        
        profileImage.addEventListener('mouseleave', () => {
            if (idCard) {
                idCard.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    }
    
    // Terminal button effects
    document.querySelectorAll('.terminal-button').forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Skill tag hover effects
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', function() {
    const terminalLine = document.getElementById('terminal-line');
    const terminalInput = document.getElementById('terminal-input');
    const currentCommand = document.getElementById('current-command');

    if (terminalLine && terminalInput && currentCommand) {
        terminalLine.addEventListener('click', function() {
            terminalInput.focus();
        });
        terminalInput.addEventListener('input', function() {
            currentCommand.textContent = terminalInput.value;
        });
    }
});