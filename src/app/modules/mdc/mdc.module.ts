import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { ButtonComponent } from './components/button/button.component';
import { CardActionButtonsComponent } from './components/card-action-buttons/card-action-buttons.component';
import { CardActionIconsComponent } from './components/card-action-icons/card-action-icons.component';
import { CardActionsComponent } from './components/card-actions/card-actions.component';
import { CardMediaComponent } from './components/card-media/card-media.component';
import { CardPrimaryActionComponent } from './components/card-primary-action/card-primary-action.component';
import { CardComponent } from './components/card/card.component';
import { ChipIconComponent } from './components/chip-icon/chip-icon.component';
import { ChipSetComponent } from './components/chip-set/chip-set.component';
import { ChipTextComponent } from './components/chip-text/chip-text.component';
import { ChipComponent } from './components/chip/chip.component';
import { DialogBackdropComponent } from './components/dialog-backdrop/dialog-backdrop.component';
import { DialogBodyComponent } from './components/dialog-body/dialog-body.component';
import { DialogDescriptionComponent } from './components/dialog-description/dialog-description.component';
import { DialogFooterButtonComponent } from './components/dialog-footer-button/dialog-footer-button.component';
import { DialogFooterComponent } from './components/dialog-footer/dialog-footer.component';
import { DialogHeaderTitleComponent } from './components/dialog-header-title/dialog-header-title.component';
import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component';
import { DialogLabelComponent } from './components/dialog-label/dialog-label.component';
import { DialogSurfaceComponent } from './components/dialog-surface/dialog-surface.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DrawerContentComponent } from './components/drawer-content/drawer-content.component';
import { DrawerDrawerComponent } from './components/drawer-drawer/drawer-drawer.component';
import { DrawerToolbarSpacerComponent } from './components/drawer-toolbar-spacer/drawer-toolbar-spacer.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { ElevationComponent } from './components/elevation/elevation.component';
import { FloatingLabelComponent } from './components/floating-label/floating-label.component';
import { IconComponent } from './components/icon/icon.component';
import { ImageListImageComponent } from './components/image-list-image/image-list-image.component';
import { ImageListItemComponent } from './components/image-list-item/image-list-item.component';
import { ImageListLabelComponent } from './components/image-list-label/image-list-label.component';
import { ImageListSupportingComponent } from './components/image-list-supporting/image-list-supporting.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { LineRippleComponent } from './components/line-ripple/line-ripple.component';
import { ListDividerComponent } from './components/list-divider/list-divider.component';
import { ListItemGraphicComponent } from './components/list-item-graphic/list-item-graphic.component';
import { ListItemSecondaryTextComponent } from './components/list-item-secondary-text/list-item-secondary-text.component';
import { ListItemTextComponent } from './components/list-item-text/list-item-text.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { ListComponent } from './components/list/list.component';
import { NotchedOutlineIdleComponent } from './components/notched-outline-idle/notched-outline-idle.component';
import { NotchedOutlinePathComponent } from './components/notched-outline-path/notched-outline-path.component';
import { NotchedOutlineComponent } from './components/notched-outline/notched-outline.component';
import { SnackbarActionButtonComponent } from './components/snackbar-action-button/snackbar-action-button.component';
import { SnackbarActionWrapperComponent } from './components/snackbar-action-wrapper/snackbar-action.component';
import { SnackbarTextComponent } from './components/snackbar-text/snackbar-text.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { TabIconTextComponent } from './components/tab-icon-text/tab-icon-text.component';
import { TabIconComponent } from './components/tab-icon/tab-icon.component';
import { TabComponent } from './components/tab/tab.component';
import { TextFieldHelperTextComponent } from './components/text-field-helper-text/text-field-helper-text.component';
import { TextFieldIconComponent } from './components/text-field-icon/text-field-icon.component';
import { TextFieldInputComponent } from './components/text-field-input/text-field-input.component';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { TopAppBarActionItemComponent } from './components/top-app-bar-action-item/top-app-bar-action-item.component';
import { TopAppBarNavigationIconComponent } from './components/top-app-bar-navigation-icon/top-app-bar-navigation-icon.component';
import { TopAppBarRowComponent } from './components/top-app-bar-row/top-app-bar-row.component';
import { TopAppBarSectionComponent } from './components/top-app-bar-section/top-app-bar-section.component';
import { TopAppBarTitleComponent } from './components/top-app-bar-title/top-app-bar-title.component';
import { TopAppBarComponent } from './components/top-app-bar/top-app-bar.component';
import { TypographyComponent } from './components/typography/typography.component';
import { UtilsService } from './services/utils.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    ButtonIconComponent,
    ButtonComponent,
    CardComponent,
    CardActionButtonsComponent,
    CardActionIconsComponent,
    CardActionsComponent,
    CardMediaComponent,
    CardPrimaryActionComponent,
    ChipComponent,
    ChipIconComponent,
    ChipSetComponent,
    ChipTextComponent,
    DialogComponent,
    DialogBodyComponent,
    DialogBackdropComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    DialogFooterButtonComponent,
    DialogHeaderComponent,
    DialogHeaderTitleComponent,
    DialogLabelComponent,
    DialogSurfaceComponent,
    DrawerComponent,
    DrawerContentComponent,
    DrawerDrawerComponent,
    DrawerToolbarSpacerComponent,
    ElevationComponent,
    FloatingLabelComponent,
    IconComponent,
    ImageListComponent,
    ImageListImageComponent,
    ImageListItemComponent,
    ImageListLabelComponent,
    ImageListSupportingComponent,
    LineRippleComponent,
    ListComponent,
    ListDividerComponent,
    ListItemComponent,
    ListItemGraphicComponent,
    ListItemSecondaryTextComponent,
    ListItemTextComponent,
    NotchedOutlineComponent,
    NotchedOutlineIdleComponent,
    NotchedOutlinePathComponent,
    SnackbarComponent,
    SnackbarActionButtonComponent,
    SnackbarActionWrapperComponent,
    SnackbarTextComponent,
    TabComponent,
    TabBarComponent,
    TabIconComponent,
    TabIconTextComponent,
    TextFieldComponent,
    TextFieldIconComponent,
    TextFieldInputComponent,
    TextFieldHelperTextComponent,
    TopAppBarComponent,
    TopAppBarActionItemComponent,
    TopAppBarNavigationIconComponent,
    TopAppBarRowComponent,
    TopAppBarSectionComponent,
    TopAppBarTitleComponent,
    TypographyComponent,
  ],
  declarations: [
    ButtonIconComponent,
    ButtonComponent,
    CardComponent,
    CardActionButtonsComponent,
    CardActionIconsComponent,
    CardActionsComponent,
    CardMediaComponent,
    CardPrimaryActionComponent,
    ChipComponent,
    ChipIconComponent,
    ChipSetComponent,
    ChipTextComponent,
    DialogComponent,
    DialogBodyComponent,
    DialogBackdropComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    DialogFooterButtonComponent,
    DialogHeaderComponent,
    DialogHeaderTitleComponent,
    DialogLabelComponent,
    DialogSurfaceComponent,
    DrawerComponent,
    DrawerContentComponent,
    DrawerDrawerComponent,
    DrawerToolbarSpacerComponent,
    ElevationComponent,
    FloatingLabelComponent,
    IconComponent,
    ImageListComponent,
    ImageListImageComponent,
    ImageListItemComponent,
    ImageListLabelComponent,
    ImageListSupportingComponent,
    LineRippleComponent,
    ListComponent,
    ListDividerComponent,
    ListItemComponent,
    ListItemGraphicComponent,
    ListItemSecondaryTextComponent,
    ListItemTextComponent,
    NotchedOutlineComponent,
    NotchedOutlineIdleComponent,
    NotchedOutlinePathComponent,
    SnackbarComponent,
    SnackbarActionButtonComponent,
    SnackbarActionWrapperComponent,
    SnackbarTextComponent,
    TabComponent,
    TabBarComponent,
    TabIconComponent,
    TabIconTextComponent,
    TextFieldComponent,
    TextFieldIconComponent,
    TextFieldInputComponent,
    TextFieldHelperTextComponent,
    TopAppBarComponent,
    TopAppBarActionItemComponent,
    TopAppBarNavigationIconComponent,
    TopAppBarRowComponent,
    TopAppBarSectionComponent,
    TopAppBarTitleComponent,
    TypographyComponent,
  ],
  providers: [
    UtilsService,
  ],
})
export class MdcModule {
}
