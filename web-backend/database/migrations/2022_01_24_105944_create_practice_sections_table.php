<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePracticeSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('practice_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained('practices')->onDelete('cascade');
            $table->string('name');
            $table->integer('duration')->nullable();
            $table->longText('instruction');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('practice_sections');
    }
}
