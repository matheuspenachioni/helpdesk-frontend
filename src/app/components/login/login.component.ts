import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Credenciais } from 'src/app/models/credenciais';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  creds: Credenciais = {
    email: '',
    senha: ''
  }

  hide: boolean = true;

  myFunction() {
    this.hide = !this.hide;
  }

  email = new FormControl(null, Validators.email);
  senha = new FormControl(null, Validators.minLength(3));

  constructor(
    private toast: ToastrService,
    private router: Router,
    private service: AuthService
  ) { }

  ngOnInit(): void { }

  logar() {
    this.service.authenticate(this.creds).subscribe(resposta => {
      this.service.successfulLogin(resposta.headers.get('Authorization').substring(7));
      localStorage.setItem('email', this.creds.email);
      this.router.navigate(['']).then(() => { 
        this.toast.success('Login realizado com sucesso!', 'Login') 
      })
    }, () => {
      this.toast.error('Usuário e/ou senha inválidos');
      this.creds.senha = '';
    })
  }

  validaCampos(): boolean {
    return this.email.valid && this.senha.valid;
  }

}