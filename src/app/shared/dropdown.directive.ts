import { Directive, HostBinding, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit{
  @HostBinding('class.open') open: boolean;

  constructor() { }

  ngOnInit(): void {
    this.open = false;
  }

  @HostListener('click') toggleOpen() {
    this.open = !this.open;
  }
}
