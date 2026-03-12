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
             applyBtn.textContent = 'Redirecting to Checkout...';
             applyBtn.style.opacity = '0.7';
             setTimeout(() => {
                 window.open('https://pay.withcherry.com/skin-refine-medspa-', '_blank');
                 applyBtn.textContent = 'See if you qualify';
                 applyBtn.style.opacity = '1';
             }, 600);
        });
    }

    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
             // Mock sending user to portal
             manageBtn.textContent = 'Opening Portal...';
             manageBtn.style.backgroundColor = '#f1f5f9';
             setTimeout(() => {
                 window.open('https://pay.withcherry.com/', '_blank');
                 manageBtn.textContent = 'Manage your account';
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
                                        
                                        <div class="checkout-grid">
                                            <div class="input-group checkout-full">
                                                <label for="card-name">Name on Card</label>
                                                <input type="text" id="card-name" placeholder="John Doe">
                                            </div>
                                            <div class="input-group checkout-full">
                                                <label for="card-number">Card Number</label>
                                                <input type="text" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19">
                                            </div>
                                            <div class="input-group">
                                                <label for="card-expiry">Expiry (MM/YY)</label>
                                                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5">
                                            </div>
                                            <div class="input-group">
                                                <label for="card-cvc">CVC</label>
                                                <input type="text" id="card-cvc" placeholder="123" maxlength="4">
                                            </div>
                                        </div>
                                        <button class="btn-cherry btn-submit-payment w-full" id="submit-payment-btn">Authorize $${monthlyPayment} Down Payment</button>
                                        <div class="checkout-lock-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                            Secure encrypted checkout
                                        </div>
                                    </div>
                                `;

                                // Setup form formatters & success listener
                                setTimeout(() => {
                                    const cardNum = document.getElementById('card-number');
                                    const cardExp = document.getElementById('card-expiry');
                                    const btnSubmit = document.getElementById('submit-payment-btn');
                                    const btnBack = document.getElementById('checkout-back-btn');

                                    if(btnBack) {
                                        btnBack.addEventListener('click', function() {
                                            cherryCalcBtn.click(); // Rerender calculation list
                                        });
                                    }

                                    if(cardNum) {
                                        cardNum.addEventListener('input', function (e) {
                                            let val = e.target.value.replace(/\D/g, '');
                                            val = val.replace(/(.{4})/g, '$1 ').trim();
                                            e.target.value = val;
                                        });
                                    }

                                    if(cardExp) {
                                        cardExp.addEventListener('input', function(e) {
                                            let val = e.target.value.replace(/\D/g, '');
                                            if (val.length > 2) {
                                                val = val.substring(0,2) + '/' + val.substring(2);
                                            }
                                            e.target.value = val;
                                        });
                                    }

                                    if(btnSubmit) {
                                        btnSubmit.addEventListener('click', function() {
                                            btnSubmit.textContent = "Processing...";
                                            btnSubmit.style.opacity = "0.7";
                                            setTimeout(() => {
                                                cherryCalcResults.innerHTML = `
                                                    <div style="text-align:center; padding: 2rem 0;">
                                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" style="margin-bottom:1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                        <h4 style="color:#059669; font-size:1.25rem; font-weight:800; margin-bottom:0.5rem;">Payment Successful</h4>
                                                        <p style="color:#475569; font-size:0.95rem;">Your $${monthlyPayment} down payment has been processed securely.</p>
                                                    </div>
                                                `;
                                            }, 1500);
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
});
