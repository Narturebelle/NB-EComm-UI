import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { PregnancyStage } from '../../models/maternal.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="container login-container">
        <div class="login-box card glass">
          <div class="login-header">
            <span class="logo-icon">🌿</span>
            <h2>Welcome to NartureBelle</h2>
            <p>Access your personalized Doctor-Approved pregnancy routine, checkup scan alerts, and live sessions.</p>
          </div>

          <!-- Auth Tabs: Google 1-Tap vs Phone OTP -->
          <div class="auth-tabs">
            <button type="button" class="auth-tab" [class.active]="activeTab === 'GOOGLE'" (click)="activeTab = 'GOOGLE'">
              Google Sign-In
            </button>
            <button type="button" class="auth-tab" [class.active]="activeTab === 'PHONE'" (click)="activeTab = 'PHONE'">
              Mobile OTP
            </button>
          </div>

          <!-- TAB 1: GOOGLE SIGN-IN -->
          @if (activeTab === 'GOOGLE') {
            <div class="tab-content">
              <div class="google-login-action">
                <button (click)="loginWithGoogle()" class="google-btn">
                  <svg class="google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div class="or-divider"><span>OR CUSTOMIZE PROFILE</span></div>

              <div class="stage-onboarding">
                <label class="form-label">Select Your Current Stage:</label>
                <div class="stage-pill-select">
                  <button type="button" class="s-pill" [class.selected]="selectedStage === 'MONTH_3'" (click)="selectedStage = 'MONTH_3'">
                    Month 3 (1st Trim)
                  </button>
                  <button type="button" class="s-pill" [class.selected]="selectedStage === 'MONTH_6'" (click)="selectedStage = 'MONTH_6'">
                    Month 6 (2nd Trim)
                  </button>
                  <button type="button" class="s-pill" [class.selected]="selectedStage === 'MONTH_9'" (click)="selectedStage = 'MONTH_9'">
                    Month 9 (3rd Trim)
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: PHONE OTP -->
          @if (activeTab === 'PHONE') {
            <div class="tab-content">
              @if (!otpSent) {
                <form (ngSubmit)="sendOtp()">
                  <div class="form-group">
                    <label class="form-label">Mobile Number</label>
                    <input type="tel" [(ngModel)]="phone" name="phone" placeholder="Enter 10-digit mobile number" class="form-control" required />
                  </div>

                  <div class="stage-onboarding">
                    <label class="form-label">Current Pregnancy Month:</label>
                    <select [(ngModel)]="selectedStage" name="stage" class="form-control">
                      <option value="MONTH_3">Month 1–3 (First Trimester)</option>
                      <option value="MONTH_6">Month 4–6 (Second Trimester)</option>
                      <option value="MONTH_9">Month 7–9 (Third Trimester)</option>
                    </select>
                  </div>

                  <button type="submit" class="btn btn-primary btn-lg full-w mt-2" [disabled]="!phone || isSubmitting">
                    {{ isSubmitting ? 'Sending OTP...' : 'Send SMS Verification Code' }}
                  </button>
                </form>
              } @else {
                <form (ngSubmit)="verifyOtp()">
                  <div class="form-group">
                    <label class="form-label">Enter 6-Digit OTP</label>
                    <input type="text" [(ngModel)]="otpCode" name="otp" placeholder="Enter 123456" class="form-control text-center text-lg" required />
                    <small class="form-hint">Code sent to {{ phone }}. Demo code: <strong>123456</strong></small>
                  </div>

                  <button type="submit" class="btn btn-primary btn-lg full-w mt-2">
                    Verify & Sign In &rarr;
                  </button>

                  <button type="button" (click)="otpSent = false" class="btn btn-outline btn-sm full-w mt-1">
                    Change Mobile Number
                  </button>
                </form>
              }
            </div>
          }

          <div class="login-footer">
            <p>🔒 By continuing, you agree to NartureBelle's Privacy Policy. We never spam; you receive only doctor-reviewed maternal wellness guidance.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      padding: 5rem 0;
      background: radial-gradient(circle at 50% 30%, rgba(251, 230, 221, 0.6) 0%, transparent 60%);
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
    }
    .login-container {
      display: flex;
      justify-content: center;
    }
    .login-box {
      width: 100%;
      max-width: 480px;
      padding: 3rem 2.5rem;
      border-radius: var(--radius-xl);
      background: #fff;
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-icon {
      font-size: 2.2rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    .login-header h2 {
      font-size: 1.75rem;
      color: var(--sage-900);
      margin-bottom: 0.35rem;
    }
    .login-header p {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .auth-tabs {
      display: flex;
      background: var(--sage-50);
      padding: 0.3rem;
      border-radius: var(--radius-full);
      margin-bottom: 1.75rem;
    }
    .auth-tab {
      flex: 1;
      padding: 0.6rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    .auth-tab.active {
      background: #fff;
      color: var(--sage-900);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }

    .google-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-md);
      border: 1.5px solid var(--border-light);
      background: #fff;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .google-btn:hover {
      background: var(--sage-50);
      border-color: var(--sage-600);
    }
    .google-icon {
      width: 20px;
      height: 20px;
    }

    .or-divider {
      text-align: center;
      margin: 1.75rem 0 1.25rem 0;
      position: relative;
    }
    .or-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border-light);
    }
    .or-divider span {
      position: relative;
      background: #fff;
      padding: 0 0.75rem;
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .stage-onboarding {
      margin-top: 1rem;
      margin-bottom: 1.5rem;
    }
    .stage-pill-select {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin-top: 0.4rem;
    }
    .s-pill {
      padding: 0.6rem 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      background: #fff;
      cursor: pointer;
      text-align: center;
    }
    .s-pill.selected {
      background: var(--sage-700);
      color: #fff;
      border-color: var(--sage-700);
    }

    .form-hint {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }
    .text-center { text-align: center; }
    .text-lg { font-size: 1.25rem; letter-spacing: 0.2em; font-weight: 700; }
    .full-w { width: 100%; }
    .mt-1 { margin-top: 0.5rem; }
    .mt-2 { margin-top: 1rem; }

    .login-footer {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }
    .login-footer p {
      font-size: 0.72rem;
      color: var(--text-muted);
      line-height: 1.45;
    }
  `]
})
export class LoginComponent {
  api = inject(ApiService);
  router = inject(Router);

  activeTab: 'GOOGLE' | 'PHONE' = 'GOOGLE';
  selectedStage: PregnancyStage = 'MONTH_3';

  phone = '';
  otpCode = '';
  otpSent = false;
  isSubmitting = false;

  loginWithGoogle() {
    const payload = {
      provider: 'GOOGLE',
      email: 'mother@example.com',
      name: 'Radhika Sharma',
      stage: this.selectedStage
    };

    this.api.login(payload).subscribe(res => {
      this.api.setUser(res.user);
      this.api.showToast('Welcome back, Radhika! Signed in with Google.');
      this.navigateToStage();
    });
  }

  sendOtp() {
    if (!this.phone) return;
    this.isSubmitting = true;

    this.api.sendOtp(this.phone).subscribe(res => {
      this.isSubmitting = false;
      this.otpSent = true;
      this.api.showToast(res.message);
    });
  }

  verifyOtp() {
    if (!this.otpCode) return;

    const payload = {
      provider: 'PHONE',
      phone: this.phone,
      otp: this.otpCode,
      stage: this.selectedStage
    };

    this.api.login(payload).subscribe(res => {
      this.api.setUser(res.user);
      this.api.showToast('Successfully signed in via Mobile OTP!');
      this.navigateToStage();
    });
  }

  private navigateToStage() {
    if (this.selectedStage === 'MONTH_6') {
      this.router.navigateByUrl('/products/month-6');
    } else if (this.selectedStage === 'MONTH_9') {
      this.router.navigateByUrl('/products/month-9');
    } else {
      this.router.navigateByUrl('/products/month-3');
    }
  }
}
