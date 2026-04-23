/* extracted from views/index.ejs */
document.getElementById('loginBtn').addEventListener('click', function(e) {
                        e.preventDefault();
                        const remember = document.getElementById('rememberMe').checked;
                        window.location.href = '/auth/google?remember=' + remember;
                    });
