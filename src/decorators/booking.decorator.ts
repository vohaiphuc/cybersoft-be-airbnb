import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDateAfterToday', async: false })
export class IsDateAfterTodayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: Date, args: ValidationArguments) {
    let ngay_den = new Date(value);
    ngay_den.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return ngay_den > today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ngày phải sau ngày hiện tại';
  }
}

@ValidatorConstraint({ name: 'isDateAfterCheckinDay', async: false })
export class IsDateAfterCheckinDayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: Date, args: ValidationArguments) {
    const ngay_den = args.object['ngay_den'];
    return value > ngay_den;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ngày đi phải sau ngày đến';
  }
}

export function IsDateAfterToday(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateAfterTodayConstraint,
    });
  };
}

export function IsDateAfterCheckinDay(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateAfterCheckinDayConstraint,
    });
  };
}
