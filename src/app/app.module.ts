import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
	declarations: [
		AppComponent, 
		ClickOutsideDirective,
		MainPageComponent, 
		SearchComponent, 
		SettingsComponent, 
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		FormsModule,
	],
	providers: [
		provideHttpClient(withInterceptorsFromDi())
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
