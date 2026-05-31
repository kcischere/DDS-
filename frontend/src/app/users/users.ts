import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { UserService } from './users.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatToolbarModule, MatButtonModule, MatInputModule, MatTableModule, MatFormFieldModule, MatCardModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef); 
  
  users: any[] = [];
  name = ''; username = ''; password = ''; role = 'User';

  ngOnInit() { this.getUsers(); }

  getUsers() {
    this.userService.getUsers().subscribe(data => { this.users = data; this.cdr.detectChanges(); });
  }

  addUser() {
    this.userService.addUser(this.name, this.username, this.password, this.role).subscribe(() => {
      this.name = ''; this.username = ''; this.password = ''; this.getUsers();
    });
  }

  editUser(user: any) {
    const newName = prompt('Enter new name:', user.name);
    const newUsername = prompt('Enter new username:', user.username);
    const newRole = prompt('Enter new role (Admin/User):', user.role);
    if (newName && newUsername && newRole) {
      this.userService.updateUser(user.id, newName, newUsername, newRole).subscribe(() => this.getUsers());
    }
  }

  disableUser(id: number) { this.userService.disableUser(id).subscribe(() => this.getUsers()); }
  enableUser(id: number) { this.userService.enableUser(id).subscribe(() => this.getUsers()); }
  softDeleteUser(id: number) { this.userService.softDeleteUser(id).subscribe(() => this.getUsers()); }
}