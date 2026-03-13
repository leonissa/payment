document.addEventListener('DOMContentLoaded', () => {
    // Scroll Spy functionality removed (sidebar removed)

    // Cherry Widget Functionality
    const cherryAmountInput = document.getElementById('cherry-amount-input');
    const cherryCalcBtn = document.getElementById('cherry-calc-btn');
    const cherryCalcResults = document.getElementById('cherry-calc-results');
    
    // Quick link buttons
    const applyBtn = document.querySelector('.btn-cherry-primary:not(#cherry-calc-btn)');
    const manageBtn = document.querySelector('.btn-cherry-secondary');

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
             // Mock sending user to application page
             applyBtn.textContent = 'Opening Subscription Form...';
             applyBtn.style.opacity = '0.7';
             setTimeout(() => {
                 applyBtn.textContent = 'Application Started (Demo)';
                 applyBtn.style.opacity = '1';
             }, 600);
        });
    }

    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
             // Mock sending user to portal
             manageBtn.textContent = 'Loading Subscriber Portal...';
             manageBtn.style.backgroundColor = '#f1f5f9';
             setTimeout(() => {
                 manageBtn.textContent = 'Login Required (Demo)';
                 manageBtn.style.backgroundColor = 'white';
             }, 600);
        });
    }

    if (cherryAmountInput && cherryCalcBtn && cherryCalcResults) {
        // Restrict input to numbers only and max 5 digits
        cherryAmountInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if(value.length > 5) value = value.slice(0, 5);
            e.target.value = value;
            
            // Adjust input width based on content length
            e.target.style.width = Math.max(45, value.length * 10) + 'px';
        });

        // Initialize width
        cherryAmountInput.style.width = Math.max(45, cherryAmountInput.value.length * 10) + 'px';

        // Calculate functionality
        cherryCalcBtn.addEventListener('click', function() {
            const amount = parseInt(cherryAmountInput.value) || 0;
            
            if (amount < 200) {
                cherryCalcResults.innerHTML = '<p style="color: #dc2626; font-size: 0.9rem; font-weight: 500;">Minimum checkout amount is typically $200.</p>';
                cherryCalcResults.className = 'cherry-results-visible';
                return;
            }

            // Mock calculations
            const planWeekly6 = (amount / 6).toFixed(2); // Mocking 6 weeks
            const planWeekly12 = (amount / 12).toFixed(2); // Mocking 12 weeks
            const plan3 = (amount / 3).toFixed(2);
            const plan6 = (amount / 6).toFixed(2);
            const plan12 = ((amount * 1.0599) / 12).toFixed(2); // Mocking 5.99% APR
            
            cherryCalcBtn.textContent = "Calculating...";
            cherryCalcBtn.style.opacity = "0.8";

            // Simulating API loading briefly
            setTimeout(() => {
                cherryCalcBtn.textContent = "Get personalized options";
                cherryCalcBtn.style.opacity = "1";
                cherryCalcResults.innerHTML = `
                    <div class="payment-plan payment-option" data-plan="6" data-type="Week" data-abbrev="wk" data-price="${planWeekly6}">
                        <span style="font-weight:700;">6 Weeks (0% APR)</span>
                        <span style="font-weight:600;">$${planWeekly6} / wk</span>
                    </div>
                    <div class="payment-plan payment-option" data-plan="12" data-type="Week" data-abbrev="wk" data-price="${planWeekly12}">
                        <span style="font-weight:700;">12 Weeks (0% APR)</span>
                        <span style="font-weight:600;">$${planWeekly12} / wk</span>
                    </div>
                    <div class="payment-plan payment-option" data-plan="3" data-type="Month" data-abbrev="mo" data-price="${plan3}">
                        <span style="font-weight:700;">3 Months (0% APR)</span>
                        <span style="font-weight:600;">$${plan3} / mo</span>
                    </div>
                    <div class="payment-plan payment-option" data-plan="6" data-type="Month" data-abbrev="mo" data-price="${plan6}">
                        <span style="font-weight:700;">6 Months (0% APR)</span>
                        <span style="font-weight:600;">$${plan6} / mo</span>
                    </div>
                    <div class="payment-plan payment-option" data-plan="12" data-type="Month" data-abbrev="mo" data-price="${plan12}">
                        <span style="font-weight:700;">12 Months (5.99% APR)</span>
                        <span style="font-weight:600;">$${plan12} / mo</span>
                    </div>
                    <p style="font-size: 0.75rem; color: #64748b; margin-top: 1rem; text-align: center;">These are estimated payments. Final terms subject to approval.</p>
                `;
                cherryCalcResults.className = 'cherry-results-visible';

                // Setup click to checkout on the plans themselves
                setTimeout(() => {
                    const options = document.querySelectorAll('.payment-option');
                    options.forEach(opt => {
                        opt.addEventListener('click', function() {
                            const timeVal = this.getAttribute('data-plan');
                            const timeType = this.getAttribute('data-type');
                            const timeAbbrev = this.getAttribute('data-abbrev');
                            const monthlyPayment = this.getAttribute('data-price');
                            
                            // Visual feedback
                            this.innerHTML = `<span style="font-weight:700; display:flex; gap:0.5rem; align-items:center;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C0B43" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v4"></path></svg>
                                Preparing secure checkout...
                            </span>`;
                            this.style.pointerEvents = "none";
                            
                            // Load custom card form instead of routing out
                            setTimeout(() => {
                                cherryCalcResults.innerHTML = `
                                    <div class="checkout-form">
                                        <div class="checkout-header">
                                            <h5 class="checkout-title">Complete Card Payment</h5>
                                            <span class="checkout-back-link" id="checkout-back-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                                Back
                                            </span>
                                        </div>
                                        <p class="checkout-subtitle">You selected the <strong>${timeVal}-${timeType}</strong> plan at <strong>$${monthlyPayment}/${timeAbbrev}</strong>.</p>
                                        <div class="checkout-grid mb-4" id="stripe-checkout-wrapper">
                                            <div class="input-group checkout-full">
                                                <label for="card-name">Full Name <span style="color:red">*</span></label>
                                                <input type="text" id="card-name" placeholder="John Doe" required>
                                            </div>
                                            <div class="input-group checkout-full">
                                                <label for="card-email">Email Address <span style="color:red">*</span></label>
                                                <input type="email" id="card-email" placeholder="john@example.com" required>
                                            </div>
                                            
                                            <div id="payment-element" style="margin-top: 1rem;">
                                                <!--Stripe.js injects the Payment Element here -->
                                                <div style="text-align:center; padding: 2rem; color: #64748b;">Loading secure payment inputs...</div>
                                            </div>
                                            
                                            <div id="stripe-error" style="color: #ef4444; font-size: 0.85rem; text-align: center; margin-top: 1rem; display: none;"></div>
                                        </div>
                                        <button class="btn-cherry btn-submit-payment w-full" id="submit-payment-btn" disabled>Loading Checkout...</button>
                                        <div class="checkout-lock-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                            Secure automated billing
                                        </div>
                                    </div>
                                `;

                                // Setup Stripe Elements Logic 
                                setTimeout(async () => {
                                    const btnSubmit = document.getElementById('submit-payment-btn');
                                    const btnBack = document.getElementById('checkout-back-btn');
                                    const errorMsg = document.getElementById('stripe-error');
                                    let elements, stripeClient;

                                    if(btnBack) {
                                        btnBack.addEventListener('click', function() {
                                            cherryCalcBtn.click(); // Rerender calculation list
                                        });
                                    }

                                    // Fetch intent from our node server
                                    try {
                                        const response = await fetch('/create-subscription', {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                amount: monthlyPayment,
                                                interval: timeType
                                            })
                                        });
                                        const { clientSecret, publishableKey } = await response.json();
                                        
                                        stripeClient = Stripe(publishableKey);
                                        elements = stripeClient.elements({ clientSecret });
                                        const paymentElement = elements.create("payment");
                                        
                                        // Clear the loading message and mount real secure frame
                                        document.getElementById('payment-element').innerHTML = '';
                                        paymentElement.mount("#payment-element");

                                        // Ready for submission
                                        btnSubmit.textContent = `Start $${monthlyPayment}/${timeAbbrev} Subscription`;
                                        btnSubmit.disabled = false;
                                        
                                    } catch (e) {
                                        console.error("Failed to load checkout", e);
                                        errorMsg.textContent = "Failed to load secure checkout. Please try again.";
                                        errorMsg.style.display = 'block';
                                    }

                                    // Handle payment submission
                                    if(btnSubmit) {
                                        btnSubmit.addEventListener('click', async function() {
                                            const nameVal = document.getElementById('card-name').value.trim();
                                            const emailVal = document.getElementById('card-email').value.trim();

                                            if (!nameVal || !emailVal) {
                                                errorMsg.textContent = 'Please fill out your name and email.';
                                                errorMsg.style.display = 'block';
                                                return;
                                            }

                                            errorMsg.style.display = 'none';
                                            btnSubmit.textContent = "Processing...";
                                            btnSubmit.style.opacity = "0.7";
                                            btnSubmit.disabled = true;

                                            // Confirm Payment directly through Stripe Elements
                                            const { error } = await stripeClient.confirmPayment({
                                                elements,
                                                confirmParams: {
                                                    // This will ultimately bounce the user, but we'll manually intercept the response in a real prod env
                                                    // For mock/visual purposes, we handle the error flow or redirect flow.
                                                    return_url: window.location.href, 
                                                    payment_method_data: {
                                                        billing_details: {
                                                            name: nameVal,
                                                            email: emailVal
                                                        }
                                                    }
                                                },
                                            });

                                            // Elements only returns on error because it normally redirects on success
                                            if (error) {
                                                errorMsg.textContent = error.message;
                                                errorMsg.style.display = 'block';
                                                btnSubmit.textContent = `Start $${monthlyPayment}/${timeAbbrev} Subscription`;
                                                btnSubmit.style.opacity = "1";
                                                btnSubmit.disabled = false;
                                            }
                                        });
                                    }
                                }, 50);

                            }, 800);
                        });
                    });
                }, 50);
            }, 400);
        });
    }

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            
            // Close other open answers (optional, accordion style)
            const activeItem = document.querySelector('.faq-item.active');
            if(activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-answer').style.maxHeight = '0';
            }

            // Toggle current state
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
});
