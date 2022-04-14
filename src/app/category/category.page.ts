import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categoryName: string = '';
  categories: any = [];

  constructor(public database: DatabaseService) {
    this.database.createDatabase().then(() => {
      // will call get categories
      this.getCategories();
    });
  }

  ngOnInit() {}

  addCategory() {
    if (!this.categoryName.length) {
      alert('Enter category name');
      return;
    }

    this.database.addCategory(this.categoryName).then((data) => {
      this.categoryName = '';
      alert(data);
      this.getCategories();
    });
  }

  getCategories() {
    this.database.getCategories().then((data) => {
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }
      }
    });
  }
}
