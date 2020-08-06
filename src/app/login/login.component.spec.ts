import { Shallow } from 'shallow-render';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

import { LoginComponent } from './login.component';
import { AlertService, AuthenticationService } from '@root/_services';
import { ComponentFixture } from '@angular/core/testing';
import { MockAuthenticationService } from '@root/__mocks__/authentication.mock.service';

const routes: Routes = [{ path: 'home', component: class DummyComponent {} }];
const mockAuthenticationService = MockAuthenticationService();

describe('LoginComponent', () => {
  let shallow: Shallow<LoginComponent>;
  let fixture: ComponentFixture<LoginComponent[]>;
  let instance: LoginComponent;
  let find: any;

  @NgModule({
    imports: [
      FormsModule,
      HttpClientModule,
      RouterModule.forRoot(routes)
    ],
    declarations: [LoginComponent],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: AuthenticationService, useValue: mockAuthenticationService },
    ],
  })
  class TestingModule {}

  beforeEach(() => {
    shallow = new Shallow(LoginComponent, TestingModule).replaceModule(
      RouterModule,
      RouterTestingModule.withRoutes(routes)
    );
    shallow.mock(AlertService, { clear: () => true });
    shallow.dontMock(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', async () => {
    ({ find } = await shallow.render());

    expect(find('form')).toBeTruthy();
  });

  describe('inputs', () => {
    const detectInputChanges = (inputName: string, expectedValue: string): void => {
      it(`updates the ${inputName} property when the value changes`, async () => {
        ({find, instance, fixture } = await shallow.render());
        const emailInput = find(`#${inputName}`);

        emailInput.nativeElement.value = expectedValue;
        emailInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(instance.form.value[inputName]).toBe(expectedValue);
      });
    };

    detectInputChanges('email', 'foo@bar.com');

    detectInputChanges('password', 'testPassword');
  });

  describe('validations', () => {
    let formControls: any;
    let input: any;

    beforeEach(async () => {
      ({ find, fixture, instance } = await shallow.render());

      formControls = instance.form.controls;
    });

    it('is a valid form with a valid email and password', async () => {
      formControls['email'].setValue('foo@bar.com');
      formControls['password'].setValue('password');
      expect(instance.form.valid).toBeTruthy();
    });

    describe('email', () => {
      let inputName: string = 'email';

      beforeEach(() => {
        input = fixture.nativeElement.querySelector(`input[name="${inputName}"]`);
      });

      describe('the field is touched', () => {
        beforeEach(() => {
          formControls[inputName].markAsTouched();
        });

        describe('the email input is invalid', () => {
          beforeEach(() => {
            input.value = "foo@bar";
            fixture.detectChanges();
          });

          it('shows an error message with an invalid email', async () => {
            expect(
              fixture.nativeElement.querySelector('p').innerHTML
            ).toEqual(
              'Email is required'
            );
          });
        });

        describe('no email is entered', () => {
          beforeEach(() => {
            input.value = "";
            fixture.detectChanges();
          });

          it('shows an error message with an empty email', () => {
            expect(
              fixture.nativeElement.querySelector('p').innerHTML
            ).toEqual(
              'Email is required'
            )
          });
        });
      });

      describe('the field is not touched', () => {
        it("doesn't raise an error if the field is not touched", () => {
          expect(find('p')).toHaveFoundLessThan(1);
        });
      });
    });

    describe('password', () => {
      let inputName = 'password';

      beforeEach(() => {
        input = fixture.nativeElement.querySelector(`input[name="${inputName}"]`);
      });

      describe('the password field is not touched', () => {
        it('shows no error', () => {
          expect(find('p')).toHaveFoundLessThan(1);
        });
      });

      describe('the password field is touched', () => {
        beforeEach(() => {
          formControls[inputName].markAsTouched();
        });

        describe('no password is entered', () => {
          beforeEach(() => {
            input.value = "";
            fixture.detectChanges();
          });

          it('shows an error', () => {
            expect(
              fixture.nativeElement.querySelector('p').innerHTML
            ).toEqual('Password is required');
          });
        });
      });
    });
  });

  describe('submit', () => {
    let formControls: any;

    beforeEach(async () => {
      ({ instance, find } = await shallow.render());
      formControls = instance.form.controls;
    });

    it('submits the email and password to the authenticationService', async () => {
      formControls['email'].setValue('foo@bar.com');
      formControls['password'].setValue('password');

      find('form').triggerEventHandler('submit', {});
      expect(mockAuthenticationService.login).toHaveBeenCalled();
    });

    it("doesn't submit the form if the form is invalid", () => {
      formControls['email'].setValue('invalidEmail');
      formControls['password'].setValue('');

      find('form').triggerEventHandler('submit', {});
      expect(mockAuthenticationService.login).toHaveBeenCalledTimes(0);
    });

    it('resets the alerts on submit', () => {

    });

    it('updates the submitted value to true', () => {

    });

    it('updates the loading value to true', () => {

    });

    describe('onSuccessful authentication', () => {
      it('it navigates to the returnUrl', () => {

      });

      describe('no returnUrl param', () => {
        it('it goes to the home page if no returnUrl', () => {

        });
      });
    });

    describe('onError', () => {
      it('sends the error to the alertService on error', () => {

      });

      it('updates the loading value to false', () => {

      });
    });
  });
});
