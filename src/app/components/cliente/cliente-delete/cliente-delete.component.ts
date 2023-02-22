import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['../cliente-create/cliente-create.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  constructor(
    private service: ClienteService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(resposta => {
      resposta.perfis = []
      this.cliente = resposta;
    })
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Você realmente quer deletar esse Técnico?',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(this.cliente.id).subscribe(() => {
          this.toast.success('Técnico deletado com sucesso!', this.cliente.nome);
          this.router.navigate(['clientes'])
        }, ex => {
          if (ex.error.errors) {
            ex.error.errors.forEach(element => {
              this.toast.error(element.message);
            });
          } else {
            this.toast.error(ex.error.message);
          }
        })
      }
    })
  }

}